/**
 * 🚀 QUICK START JARVIS - Bypass MindSearch for now
 * 
 * This gets your JARVIS interface running immediately while we resolve
 * the MindSearch integration dependency issues.
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class QuickJarvisBootstrap {
    constructor() {
        this.processes = [];
    }

    async boot() {
        console.log('🌟 JARVIS ZERO - QUICK START PROTOCOL');
        console.log('═══════════════════════════════════════');
        console.log('🧠 Launching core consciousness interface...\n');

        try {
            // Check if Vite dev server is already running
            await this.checkViteServer();
            
            console.log('✅ JARVIS consciousness interface is ready!');
            console.log('\n🌐 Access your JARVIS Zero at:');
            console.log('   🔗 http://localhost:3001');
            console.log('   🔗 http://192.168.0.213:3001 (network access)\n');
            
            console.log('🎯 Available Features:');
            console.log('   ✨ Holographic Interface');
            console.log('   🧠 Advanced AI Personality');
            console.log('   💾 Memory Formation');
            console.log('   🎤 Voice Interaction');
            console.log('   ⚙️  Configuration Panel\n');
            
            console.log('📝 Note: MindSearch integration will be activated once dependencies are resolved.\n');
            
            this.setupShutdownHandlers();
            
        } catch (error) {
            console.error('❌ Quick start failed:', error.message);
            process.exit(1);
        }
    }

    async checkViteServer() {
        try {
            const { stdout } = await execAsync('lsof -i :3001');
            if (stdout.includes('node')) {
                console.log('✅ Vite development server is running on port 3001');
                return true;
            }
        } catch (error) {
            // Server not running, try to start it
            console.log('🚀 Starting Vite development server...');
            return this.startViteServer();
        }
    }

    async startViteServer() {
        return new Promise((resolve, reject) => {
            const viteProcess = spawn('npm', ['run', 'dev'], {
                stdio: 'pipe',
                cwd: process.cwd()
            });

            this.processes.push(viteProcess);

            let serverReady = false;

            viteProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(output);
                
                if (output.includes('ready in') && output.includes('Local:')) {
                    serverReady = true;
                    resolve(true);
                }
            });

            viteProcess.stderr.on('data', (data) => {
                console.error('Vite error:', data.toString());
            });

            viteProcess.on('close', (code) => {
                if (!serverReady) {
                    reject(new Error(`Vite server exited with code ${code}`));
                }
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                if (!serverReady) {
                    reject(new Error('Vite server startup timeout'));
                }
            }, 30000);
        });
    }

    setupShutdownHandlers() {
        const shutdown = async () => {
            console.log('\n🛑 Shutting down JARVIS Zero...');
            
            for (const process of this.processes) {
                try {
                    process.kill('SIGTERM');
                } catch (error) {
                    console.error('Error stopping process:', error.message);
                }
            }
            
            console.log('💤 JARVIS Zero offline. Goodbye!');
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        
        // Keep the process alive
        setInterval(() => {}, 1000);
    }
}

// Run the quick start
const jarvis = new QuickJarvisBootstrap();
jarvis.boot(); 