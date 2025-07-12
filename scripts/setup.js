#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 VukaLink Setup Script');
  console.log('========================\n');

  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
  } else {
    console.log('📝 Creating .env file...');
    
    if (!fs.existsSync(envExamplePath)) {
      console.error('❌ .env.example file not found. Please create it first.');
      process.exit(1);
    }

    // Copy .env.example to .env
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from .env.example');
  }

  // Check for required environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missingVars = [];

  for (const varName of requiredVars) {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=your_`)) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.log('\n⚠️  Missing or incomplete environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    
    console.log('\n📋 Please update your .env file with the following:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Settings > API');
    console.log('3. Copy the Project URL and anon/public key');
    console.log('4. Update your .env file with these values\n');
    
    const updateNow = await question('Would you like to update the .env file now? (y/N): ');
    
    if (updateNow.toLowerCase() === 'y' || updateNow.toLowerCase() === 'yes') {
      const supabaseUrl = await question('Enter your Supabase Project URL: ');
      const supabaseKey = await question('Enter your Supabase anon/public key: ');
      
      let newEnvContent = envContent;
      newEnvContent = newEnvContent.replace(/VITE_SUPABASE_URL=.*/g, `VITE_SUPABASE_URL=${supabaseUrl}`);
      newEnvContent = newEnvContent.replace(/VITE_SUPABASE_ANON_KEY=.*/g, `VITE_SUPABASE_ANON_KEY=${supabaseKey}`);
      
      fs.writeFileSync(envPath, newEnvContent);
      console.log('✅ Environment variables updated!');
    }
  } else {
    console.log('✅ All required environment variables are configured');
  }

  // Check if node_modules exists
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('\n📦 Installing dependencies...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Dependencies already installed');
  }

  // Check for database setup
  const databasePath = path.join(process.cwd(), 'DATABASE.md');
  if (fs.existsSync(databasePath)) {
    console.log('\n🗄️  Database Setup Instructions:');
    console.log('1. Open DATABASE.md in your project root');
    console.log('2. Copy the SQL schema');
    console.log('3. Go to your Supabase project dashboard');
    console.log('4. Navigate to SQL Editor');
    console.log('5. Paste and run the SQL commands');
    console.log('6. This will create all necessary tables and policies\n');
  }

  // Check for build
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('🔨 Building project...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Project built successfully');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      console.log('💡 You can still run the development server with: npm run dev');
    }
  } else {
    console.log('✅ Project already built');
  }

  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Set up your database using the instructions above');
  console.log('2. Run the development server: npm run dev');
  console.log('3. Open http://localhost:5173 in your browser');
  console.log('4. Create your first account and start using VukaLink!');
  
  console.log('\n📚 Additional Resources:');
  console.log('- README.md - Project documentation');
  console.log('- DATABASE.md - Database schema and setup');
  console.log('- saas_multitenancy_app_logic_and_docs.md - Multi-tenancy guide');

  rl.close();
}

setup().catch(console.error);