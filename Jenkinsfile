
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 40, unit: 'MINUTES')
    }

    environment {
        DEPLOY_USER = 'root'
        DEPLOY_HOST = '31.14.116.5'
        DEPLOY_PORT = '22'
        SSH_CREDENTIALS = 'deploy-ssh-key'
        DEPLOY_SCRIPT = '/var/www/consultation/deploy.sh'
    }

    stages {
        stage('Deploy consultation') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS]) {
                    sh(
                        label: 'Deploy consultation',
                        script: '''#!/bin/bash
set -Eeuo pipefail

LOG_FILE="deploy_consultation.log"

{
    echo "=========================================="
    echo "Starting consultation deployment"
    echo "Target: ${DEPLOY_HOST}:${DEPLOY_PORT}"
    echo "Time: $(date -Is)"
    echo "=========================================="

    ssh \
        -p "${DEPLOY_PORT}" \
        -o StrictHostKeyChecking=accept-new \
        -o ConnectTimeout=15 \
        "${DEPLOY_USER}@${DEPLOY_HOST}" \
        "bash '${DEPLOY_SCRIPT}'"

    echo "=========================================="
    echo "Deployment completed successfully"
    echo "=========================================="
} 2>&1 | tee "${LOG_FILE}"
'''
                    )
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'deploy_consultation.log',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'Consultation deployment succeeded.'
        }

        failure {
            echo 'Consultation deployment failed. Check the console output and archived log.'
        }
    }
}