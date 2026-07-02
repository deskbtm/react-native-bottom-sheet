#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const exampleRoot = path.join(__dirname, '..');
const credentialsDir = path.join(exampleRoot, 'credentials', 'android');
const androidAppDir = path.join(exampleRoot, 'android', 'app');
const buildGradlePath = path.join(androidAppDir, 'build.gradle');
const keystorePropertiesPath = path.join(credentialsDir, 'keystore.properties');

function readProperties(filePath) {
	const properties = {};
	for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const separator = trimmed.indexOf('=');
		if (separator === -1) continue;
		properties[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
	}
	return properties;
}

function configureReleaseSigning() {
	if (!fs.existsSync(buildGradlePath)) {
		console.error(`Missing ${buildGradlePath}. Run expo prebuild first.`);
		process.exit(1);
	}

	const properties = readProperties(keystorePropertiesPath);
	const keystoreSource = path.join(credentialsDir, properties.storeFile);
	const keystoreTarget = path.join(androidAppDir, properties.storeFile);

	if (!fs.existsSync(keystoreSource)) {
		console.error(`Missing keystore at ${keystoreSource}`);
		process.exit(1);
	}

	fs.copyFileSync(keystoreSource, keystoreTarget);

	let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

	const debugSigningMarker = `        keyPassword 'android'
        }
    }
    buildTypes {`;
	const releaseSigningConfig = `        keyPassword 'android'
        }
        release {
            storeFile file('${properties.storeFile}')
            storePassword '${properties.storePassword}'
            keyAlias '${properties.keyAlias}'
            keyPassword '${properties.keyPassword}'
        }
    }
    buildTypes {`;

	if (!buildGradle.includes('signingConfigs.release')) {
		if (!buildGradle.includes(debugSigningMarker)) {
			console.error('Unexpected android/app/build.gradle layout. Update configure-android-release-signing.js.');
			process.exit(1);
		}

		buildGradle = buildGradle.replace(debugSigningMarker, releaseSigningConfig);
	}

	const releaseBlockPattern =
		/(        release \{[\s\S]*?\/\/ see https:\/\/reactnative.dev\/docs\/signed-apk-android\.\n)            signingConfig signingConfigs\.debug/;

	if (!releaseBlockPattern.test(buildGradle)) {
		console.error('Could not locate release signingConfig in android/app/build.gradle.');
		process.exit(1);
	}

	buildGradle = buildGradle.replace(
		releaseBlockPattern,
		'$1            signingConfig signingConfigs.release'
	);

	fs.writeFileSync(buildGradlePath, buildGradle);
	console.log('Configured Android release signing for example app.');
}

configureReleaseSigning();
