#!/usr/bin/env node

/**
 * 🚀 MINDSEARCH SERVER LAUNCHER
 * 
 * Automatically starts the MindSearch server to enable JARVIS web search capabilities.
 * This gives JARVIS real-time access to the internet via DuckDuckGo search.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class MindSearchServerManager {
    constructor() {
        this.serverProcess = null;
        this.serverPath = path.join(__dirname, 'mindsearch_integration');
        this.serverUrl = 'http://localhost:8002';
        this.isRunning = false;
        this.startupTimeout = 30000; // 30 seconds to start
    }
    
    async startServer() {
        console.log('🚀 Starting MindSearch server for JARVIS web search...');
        
        // Check if the MindSearch integration exists
        if (!fs.existsSync(this.serverPath)) {
            console.error('❌ MindSearch integration not found at:', this.serverPath);
            console.log('Please ensure the MindSearch repository is cloned to mindsearch_integration/');
            return false;
        }
        
        try {
            // Start the MindSearch server
            this.serverProcess = spawn('python3', [
                '-m', 'mindsearch.app',
                '--host', '0.0.0.0',
                '--port', '8002',
                '--lang', 'en',
                '--model_format', 'gpt4', // Will work with any model
                '--search_engine', 'DuckDuckGoSearch', // Free, no API key required
                '--asy' // Asynchronous mode for better performance
            ], {
                cwd: this.serverPath,
                stdio: ['ignore', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    PYTHONPATH: this.serverPath
                }
            });
            
            // Handle server output
            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString().trim();
                if (output) {
                    console.log(`📡 MindSearch: ${output}`);
                    
                    // Check if server is ready
                    if (output.includes('Uvicorn running') || output.includes('Application startup complete')) {
                        this.isRunning = true;
                        console.log('✅ MindSearch server is ready for JARVIS web search!');
                        console.log(`🌐 Server available at: ${this.serverUrl}`);
                    }
                }
            });
            
            this.serverProcess.stderr.on('data', (data) => {
                const error = data.toString().trim();
                if (error && !error.includes('WARNING')) {
                    console.error(`⚠️ MindSearch error: ${error}`);
                }
            });
            
            this.serverProcess.on('close', (code) => {
                this.isRunning = false;
                if (code !== 0) {
                    console.error(`❌ MindSearch server exited with code ${code}`);
                } else {
                    console.log('🔄 MindSearch server stopped');
                }
            });
            
            this.serverProcess.on('error', (error) => {
                console.error('❌ Failed to start MindSearch server:', error.message);
                this.isRunning = false;
            });
            
            // Wait for server to start
            await this.waitForServer();
            
            return this.isRunning;
            
        } catch (error) {
            console.error('❌ Error starting MindSearch server:', error);
            return false;
        }
    }
    
    async waitForServer() {
        console.log('⏳ Waiting for MindSearch server to start...');
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < this.startupTimeout) {
            try {
                // Try to connect to the server
                const response = await fetch(`${this.serverUrl}/docs`, {
                    method: 'GET',
                    timeout: 3000
                });
                
                if (response.ok) {
                    this.isRunning = true;
                    console.log('✅ MindSearch server connection verified!');
                    return true;
                }
            } catch (error) {
                // Server not ready yet, continue waiting
            }
            
            // Wait 2 seconds before next attempt
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error('MindSearch server failed to start within timeout period');
    }
    
    async stopServer() {
        if (this.serverProcess) {
            console.log('🔄 Stopping MindSearch server...');
            this.serverProcess.kill('SIGTERM');
            
            // Give it time to shutdown gracefully
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            if (this.serverProcess && !this.serverProcess.killed) {
                console.log('🔨 Force killing MindSearch server...');
                this.serverProcess.kill('SIGKILL');
            }
            
            this.serverProcess = null;
            this.isRunning = false;
            console.log('✅ MindSearch server stopped');
        }
    }
    
    async testConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/docs`, {
                method: 'GET',
                timeout: 5000
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    async testSearch() {
        if (!this.isRunning) {
            console.log('❌ Cannot test search - server not running');
            return false;
        }
        
        try {
            console.log('🔍 Testing web search capabilities...');
            
            const testQuery = 'current time and date';
            const response = await fetch(`${this.serverUrl}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: testQuery,
                    session_id: Math.floor(Math.random() * 999999)
                })
            });
            
            if (response.ok) {
                console.log('✅ Web search test successful!');
                console.log('🌐 JARVIS now has real-time internet access');
                return true;
            } else {
                console.log('⚠️ Web search test failed:', response.status);
                return false;
            }
            
        } catch (error) {
            console.log('⚠️ Web search test error:', error.message);
            return false;
        }
    }
    
    getStatus() {
        return {
            isRunning: this.isRunning,
            serverUrl: this.serverUrl,
            processId: this.serverProcess?.pid || null,
            serverPath: this.serverPath
        };
    }
}

// CLI Interface
async function main() {
    const manager = new MindSearchServerManager();
    
    const command = process.argv[2] || 'start';
    
    switch (command) {
        case 'start':
            console.log('🚀 Starting MindSearch server for JARVIS...');
            const started = await manager.startServer();
            if (started) {
                console.log('🎉 MindSearch server started successfully!');
                console.log('🤖 JARVIS now has real-time web search capabilities');
                
                // Test the search functionality
                setTimeout(async () => {
                    await manager.testSearch();
                }, 5000);
                
                // Keep the process running
                process.on('SIGINT', async () => {
                    console.log('\n🔄 Shutting down MindSearch server...');
                    await manager.stopServer();
                    process.exit(0);
                });
                
                process.on('SIGTERM', async () => {
                    await manager.stopServer();
                    process.exit(0);
                });
                
            } else {
                console.log('❌ Failed to start MindSearch server');
                process.exit(1);
            }
            break;
            
        case 'stop':
            await manager.stopServer();
            break;
            
        case 'status':
            const status = manager.getStatus();
            console.log('📊 MindSearch Server Status:');
            console.log('  Running:', status.isRunning ? '✅ YES' : '❌ NO');
            console.log('  URL:', status.serverUrl);
            console.log('  Process ID:', status.processId || 'N/A');
            console.log('  Path:', status.serverPath);
            
            if (status.isRunning) {
                const connected = await manager.testConnection();
                console.log('  Connection:', connected ? '✅ OK' : '❌ FAILED');
            }
            break;
            
        case 'test':
            const connected = await manager.testConnection();
            if (connected) {
                await manager.testSearch();
            } else {
                console.log('❌ Server not running - cannot test search');
            }
            break;
            
        default:
            console.log('🚀 MindSearch Server Manager for JARVIS');
            console.log('');
            console.log('Usage:');
            console.log('  node start-mindsearch-server.js start   - Start the server');
            console.log('  node start-mindsearch-server.js stop    - Stop the server');
            console.log('  node start-mindsearch-server.js status  - Check server status');
            console.log('  node start-mindsearch-server.js test    - Test search functionality');
            console.log('');
            console.log('This gives JARVIS real-time web search via DuckDuckGo');
            break;
    }
}

// Export for use as module
module.exports = { MindSearchServerManager };

// Run CLI if called directly
if (require.main === module) {
    main().catch(console.error);
} 