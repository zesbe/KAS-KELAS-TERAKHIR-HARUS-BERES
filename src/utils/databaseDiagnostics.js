import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const runDatabaseDiagnostics = async () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const results = {
    connection: { status: 'unknown', message: '', details: null },
    tables: {},
    permissions: { status: 'unknown', message: '' },
    summary: { tablesExist: 0, totalTables: 5, allTablesReady: false }
  }

  const requiredTables = ['students', 'transactions', 'expenses', 'payment_links', 'campaigns']

  try {
    // Test basic connection
    console.log('Testing database connection...')
    
    // Test each table individually to identify specific issues
    for (const tableName of requiredTables) {
      try {
        console.log(`Testing table: ${tableName}`)
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)

        if (error) {
          results.tables[tableName] = {
            exists: false,
            error: error.message,
            details: error
          }
          console.error(`Error with table ${tableName}:`, error)
        } else {
          results.tables[tableName] = {
            exists: true,
            error: null,
            recordCount: data ? data.length : 0
          }
          results.summary.tablesExist++
          console.log(`Table ${tableName}: OK`)
        }
      } catch (err) {
        results.tables[tableName] = {
          exists: false,
          error: err.message || err.toString(),
          details: err
        }
        console.error(`Exception testing table ${tableName}:`, err)
      }
    }

    // Overall connection status
    if (results.summary.tablesExist > 0) {
      results.connection.status = 'connected'
      results.connection.message = 'Connected to Supabase'
    } else {
      results.connection.status = 'no_tables'
      results.connection.message = 'Connected but no tables found'
    }

    results.summary.allTablesReady = results.summary.tablesExist === results.summary.totalTables

    // Check permissions by trying to insert a test record (then delete it)
    if (results.tables.students?.exists) {
      try {
        const testStudent = {
          name: 'TEST_STUDENT_DELETE_ME',
          nickname: 'TEST',
          phone: '+1234567890'
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from('students')
          .insert(testStudent)
          .select()

        if (insertError) {
          results.permissions = {
            status: 'limited',
            message: `Insert permission denied: ${insertError.message}`,
            details: insertError
          }
        } else if (insertData && insertData.length > 0) {
          // Clean up test record
          await supabase
            .from('students')
            .delete()
            .eq('id', insertData[0].id)

          results.permissions = {
            status: 'full',
            message: 'Full read/write permissions available'
          }
        }
      } catch (permError) {
        results.permissions = {
          status: 'error',
          message: `Permission test failed: ${permError.message}`,
          details: permError
        }
      }
    }

  } catch (connectionError) {
    results.connection = {
      status: 'failed',
      message: `Connection failed: ${connectionError.message}`,
      details: connectionError
    }
    console.error('Database connection failed:', connectionError)
  }

  return results
}

export const generateSetupRecommendation = (diagnostics) => {
  const { tables, summary, connection, permissions } = diagnostics

  if (connection.status === 'failed') {
    return {
      priority: 'critical',
      title: 'Database Connection Failed',
      message: 'Cannot connect to Supabase database. Please check your configuration.',
      actions: [
        'Verify VITE_SUPABASE_URL is correct',
        'Verify VITE_SUPABASE_ANON_KEY is correct',
        'Check Supabase project status',
        'Ensure network connectivity'
      ]
    }
  }

  if (summary.tablesExist === 0) {
    return {
      priority: 'high',
      title: 'Database Tables Missing',
      message: 'Connected to Supabase but no required tables exist.',
      actions: [
        'Go to Settings → Database Setup',
        'Click "Quick Setup (Auto)" or "Manual Setup"',
        'If manual setup: copy SQL and run in Supabase SQL Editor',
        'Refresh page after setup'
      ]
    }
  }

  if (summary.tablesExist < summary.totalTables) {
    const missingTables = Object.entries(tables)
      .filter(([name, info]) => !info.exists)
      .map(([name]) => name)

    return {
      priority: 'medium',
      title: 'Incomplete Database Setup',
      message: `${summary.tablesExist}/${summary.totalTables} tables exist. Missing: ${missingTables.join(', ')}`,
      actions: [
        'Complete database setup in Settings',
        'Run missing table creation SQL',
        'Check for SQL execution errors'
      ]
    }
  }

  if (permissions.status === 'limited') {
    return {
      priority: 'medium',
      title: 'Limited Database Permissions',
      message: 'Tables exist but write permissions may be limited.',
      actions: [
        'Check Row Level Security (RLS) policies',
        'Verify anon key permissions',
        'Update Supabase table permissions if needed'
      ]
    }
  }

  return {
    priority: 'low',
    title: 'Database Ready',
    message: 'All tables exist and permissions are working.',
    actions: ['Database is properly configured']
  }
}
