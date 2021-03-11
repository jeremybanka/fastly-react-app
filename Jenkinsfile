@Library("pipeline@v2-beta") _

import pipeline.fastly.kubernetes.jenkins.PodTemplates
import pipeline.fastly.slack.SlackNotification

def slackChannel = '#stats'
def slackNotification = SlackNotification.FAILURE
def ignoreTags = true
def releaseBranch = "main"
def containers = []
def builtVersion

String emailToSlack(String email) {
  final Map emailToSlackOverride = [
    // place overrides in here if slack handles are not the users first name
    // 'someone@fastly.com': '@SomeRandomHandle'
    'hschaaf@fastly.com': '@herman',
    'spsmith@fastly.com': '@shawnps',
  ]
  if (emailToSlackOverride[email]) {
    return emailToSlackOverride[email]
  }
  return '@' + email?.split('@')[0]
}
def ref = getBuildRef().name.split('/')[-1]
if (ref != releaseBranch) {
  slackChannel = emailToSlack(params.author_email)
  slackNotification = SlackNotification.ALL
}

fastlyPipeline(script: this, ignoreTags: ignoreTags, slackChannel: slackChannel, slackNotification: slackNotification) {
  stage('Build Containers') {
    def pushImage = false
    if (isMaster(['main', 'origin/main'])) {
      pushImage = true
    }
    containers << [
      dockerFile: 'Dockerfile',
      dockerContextPath: '.',
      imageName: 'fastly/data-engineering/observe-edge-ui',
      additionalBuildArgs: [],
      cache: true,
      pushImage: pushImage
    ]
    builtVersion = fastlyDockerBuild([script: this, containers: containers])
  }
}

fastlyPipeline(script: this, ignoreTags: ignoreTags, slackChannel: slackChannel, slackNotification: slackNotification) {
  getNode(label: PodTemplates.LABEL_KUBERNETES_DEPLOY) {
    def commit = checkout(scm).GIT_COMMIT
    if (isMaster(['main', 'origin/main', 'hermanschaaf/okta-proxy', 'origin/hermanschaaf/okta-proxy'])) {
      def observeEdgeUIChartChanges = sh(script: "git log --diff-filter=d -m -1 --name-only --pretty='format:' ${commit} | { grep 'charts/observe-edge-ui' || true; }", returnStdout: true)
      def publishedVersion = fastlyPublishChart(script: this, charts: ['charts/observe-edge-ui']) // temporary
      if (observeEdgeUIChartChanges) {
          // fastlyPublish chart also runs linting
          // def publishedVersion = fastlyPublishChart(script: this, charts: ['charts/observe-edge-ui'])
    //         def pr = updateElevationData(
    //           script: this,
    //           name: "${env.JOB_BASE_NAME}-${gitCommit.take(7)}",
    //           updates: [
    //             [file: "workloads/stg-usc1/data-engineering/observe-edge-ui.yaml", keys: ["spec.chart.spec.version"], value: publishedVersion]
    //           ]
    //         )
    //         if (slackChannel) {
    //           slackSend color: 'good', message: "Created ElevationData Release [${containerName}:${imageTag}] PR: ${pr.github_pr_url}", channel: slackChannel
    //         }
      }
    } else {
      def observeEdgeUIChartChanges = sh(script: "git diff --name-only origin/main HEAD | { grep 'charts/observe-edge-ui' || true; }")
      if (observeEdgeUIChartChanges) {
        fastlyLintChart(script: this, charts: ['charts/observe-edge-ui'])
      }
    }
  }
}