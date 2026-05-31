#!/usr/bin/env node

/**
 * Admin Password Management Script
 * 
 * This script helps you set or update the admin password for Frigate Lights.
 * The password is stored in the .env file.
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function readEnvFile() {
  try {
    return readFileSync(envPath, 'utf-8')
  } catch (error) {
    log('❌ .env file not found', colors.red)
    log('Creating a new .env file...', colors.yellow)
    return ''
  }
}

function updatePassword(envContent, newPassword) {
  const lines = envContent.split('\n')
  let passwordLineIndex = -1
  
  // Find existing ADMIN_PASSWORD line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('ADMIN_PASSWORD=')) {
      passwordLineIndex = i
      break
    }
  }
  
  const newLine = `ADMIN_PASSWORD=${newPassword}`
  
  if (passwordLineIndex !== -1) {
    // Update existing line
    lines[passwordLineIndex] = newLine
  } else {
    // Add new line
    lines.push('')
    lines.push('# Admin Credentials')
    lines.push(newLine)
  }
  
  return lines.join('\n')
}

function getCurrentPassword(envContent) {
  const match = envContent.match(/ADMIN_PASSWORD=(.+)/)
  return match ? match[1].trim() : null
}

async function promptPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  return new Promise((resolve) => {
    rl.question('Enter new admin password: ', (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function main() {
  log('\n╔════════════════════════════════════════╗', colors.blue)
  log('║   Admin Password Management Tool      ║', colors.blue)
  log('╚════════════════════════════════════════╝', colors.blue)
  
  const envContent = readEnvFile()
  const currentPassword = getCurrentPassword(envContent)
  
  if (currentPassword) {
    log(`\n📋 Current password: ${colors.cyan}${currentPassword}${colors.reset}`)
  } else {
    log('\n⚠️  No admin password set', colors.yellow)
  }
  
  // Check if password provided as argument
  const newPassword = process.argv[2]
  
  let passwordToSet
  if (newPassword) {
    passwordToSet = newPassword
    log(`\n🔑 Setting password to: ${colors.cyan}${passwordToSet}${colors.reset}`)
  } else {
    log('\n💡 Enter a new password (or press Ctrl+C to cancel)', colors.blue)
    passwordToSet = await promptPassword()
    
    if (!passwordToSet) {
      log('\n❌ No password provided. Exiting.', colors.red)
      process.exit(1)
    }
  }
  
  // Validate password
  if (passwordToSet.length < 6) {
    log('\n❌ Password must be at least 6 characters long', colors.red)
    process.exit(1)
  }
  
  // Update .env file
  const updatedContent = updatePassword(envContent, passwordToSet)
  writeFileSync(envPath, updatedContent, 'utf-8')
  
  log('\n✅ Admin password updated successfully!', colors.green)
  log(`\n📝 Password: ${colors.cyan}${passwordToSet}${colors.reset}`)
  log('\n⚠️  Important:', colors.yellow)
  log('  • Keep this password secure', colors.yellow)
  log('  • Never commit .env file to version control', colors.yellow)
  log('  • Restart your dev server for changes to take effect', colors.yellow)
  
  log('\n🚀 Next steps:', colors.blue)
  log('  1. Restart dev server: pnpm dev', colors.cyan)
  log('  2. Go to: http://localhost:3000', colors.cyan)
  log('  3. Click "Admin Login"', colors.cyan)
  log(`  4. Use password: ${passwordToSet}`, colors.cyan)
}

main().catch(error => {
  log('\n❌ Error updating password', colors.red)
  console.error(error)
  process.exit(1)
})
