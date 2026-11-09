
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'TaskBoard source code downloaded.'
            }
        }

        stage('Backend Docker Build') {
            steps {
                dir('backend') {
                    sh 'docker build -t taskboard-backend:jenkins .'
                }
            }
        }

        stage('Backend Validation') {
            steps {
                sh '''
                    docker run --rm \
                    --entrypoint python \
                    taskboard-backend:jenkins \
                    -m compileall -q /app
                '''
            }
        }

        stage('Backend Tests') {
            steps {
                sh '''
                    docker run --rm \
                    --entrypoint sh \
                    taskboard-backend:jenkins \
                    -c 'if find /app -type f \\( -name "test_*.py" -o -name "*_test.py" \\) | grep -q .; then python -m pytest -q /app; else echo "No test files found. Skipping pytest."; fi'
                '''
            }
        }

        stage('Frontend Docker Build') {
            steps {
                dir('frontend') {
                    sh 'docker build -t taskboard-frontend:jenkins .'
                }
            }
        }
    }

    post {
        success {
            echo 'TaskBoard Jenkins CI completed successfully!'
        }

        failure {
            echo 'TaskBoard Jenkins CI failed. Check Console Output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
