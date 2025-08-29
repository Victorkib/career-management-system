import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Call Python ML service with command and data
 */
export const callMLService = (command, data = null, args = []) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(
      __dirname,
      '../ml_system/ml_integration_service.py'
    );

    // Windows-compatible Python execution
    const pythonExecutable =
      process.platform === 'win32'
        ? path.join(__dirname, '../ml_system/ml_env/Scripts/python.exe')
        : path.join(__dirname, '../ml_system/ml_env/bin/python');

    // Fallback to system python if virtual env python doesn't exist
    const pythonCommand = fs.existsSync(pythonExecutable)
      ? pythonExecutable
      : 'python';

    const pythonArgs = [pythonScript, command, ...args];

    const pythonProcess = spawn(pythonCommand, pythonArgs, {
      cwd: path.join(__dirname, '../ml_system'),
      env: {
        ...process.env,
        PYTHONPATH: path.join(__dirname, '../ml_system'),
        PATH: process.env.PATH,
      },
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script failed with code ${code}: ${errorOutput}`);
        reject(new Error(`Python script failed: ${errorOutput}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (error) {
        console.error(`Failed to parse Python output: ${output}`);
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error(`Failed to start Python process: ${error}`);
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    // Send input data if provided
    if (data) {
      pythonProcess.stdin.write(JSON.stringify(data));
      pythonProcess.stdin.end();
    }
  });
};

/**
 * Call Enhanced Python ML service with performance filtering
 */
export const callEnhancedMLService = (command, data = null, args = []) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(
      __dirname,
      '../ml_system/enhanced_ml_integration_service.py'
    );

    // Windows-compatible Python execution
    const pythonExecutable =
      process.platform === 'win32'
        ? path.join(__dirname, '../ml_system/ml_env/Scripts/python.exe')
        : path.join(__dirname, '../ml_system/ml_env/bin/python');

    const pythonCommand = fs.existsSync(pythonExecutable)
      ? pythonExecutable
      : 'python';

    const pythonArgs = [pythonScript, command, ...args];

    console.log(`🤖 Calling Enhanced ML Service: ${command}`);

    const pythonProcess = spawn(pythonCommand, pythonArgs, {
      cwd: path.join(__dirname, '../ml_system'),
      env: {
        ...process.env,
        PYTHONPATH: path.join(__dirname, '../ml_system'),
        PATH: process.env.PATH,
      },
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(
          `❌ Enhanced ML script failed with code ${code}: ${errorOutput}`
        );
        reject(new Error(`Enhanced ML script failed: ${errorOutput}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        console.log(`✅ Enhanced ML Service completed: ${command}`);
        resolve(result);
      } catch (error) {
        console.error(`❌ Failed to parse Enhanced ML output: ${output}`);
        reject(new Error(`Failed to parse Enhanced ML output: ${output}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error(`❌ Failed to start Enhanced ML process: ${error}`);
      reject(
        new Error(`Failed to start Enhanced ML process: ${error.message}`)
      );
    });

    // Send input data if provided
    if (data) {
      pythonProcess.stdin.write(JSON.stringify(data));
      pythonProcess.stdin.end();
    }
  });
};

/**
 * Check if ML system is available
 */
export const isMLSystemAvailable = async () => {
  try {
    const result = await callMLService('health_check');
    return result.healthy;
  } catch (error) {
    console.error('ML system not available:', error.message);
    return false;
  }
};

/**
 * Check if Enhanced ML system is available
 */
export const isEnhancedMLSystemAvailable = async () => {
  try {
    const result = await callEnhancedMLService('health_check');
    return result.healthy && result.features?.performance_filtering;
  } catch (error) {
    console.error('Enhanced ML system not available:', error.message);
    return false;
  }
};

/**
 * Get ML system status
 */
export const getMLSystemStatus = async () => {
  try {
    return await callMLService('health_check');
  } catch (error) {
    return {
      healthy: false,
      status: 'unavailable',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get Enhanced ML system status with performance filtering info
 */
export const getEnhancedMLSystemStatus = async () => {
  try {
    const status = await callEnhancedMLService('health_check');
    return {
      ...status,
      enhanced_features: {
        performance_filtering: true,
        tier_based_recommendations: true,
        intelligent_career_matching: true,
      },
    };
  } catch (error) {
    return {
      healthy: false,
      status: 'unavailable',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
