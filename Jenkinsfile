def containers = []
def builtVersion

fastlyPipeline(script: this) {
  stage('Build Containers') {
    containers << [
      dockerFile: 'Dockerfile',
      dockerContextPath: '.',
      imageName: 'fastly/data-engineering/observe-edge-ui',
      additionalBuildArgs: [],
      cache: true,
      pushImage: true
    ]
    builtVersion = fastlyDockerBuild([script: this, containers: containers])
  }
}
