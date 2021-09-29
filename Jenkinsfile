@Library("pipeline@v2-beta") _

import pipeline.fastly.kubernetes.jenkins.PodTemplates
import pipeline.fastly.slack.SlackNotification

def slackChannel = '#stats-bots'
def slackNotification = SlackNotification.FAILURE
def ignoreTags = true
def releaseBranch = "main"
def containers = []
def publishedImageVersion
def publishedChartVersion
def pr

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
    publishedImageVersion = fastlyDockerBuild([script: this, containers: containers])
  }

  getNode(label: PodTemplates.LABEL_KUBERNETES_DEPLOY) {
    def commit = checkout(scm).GIT_COMMIT
    if (isMaster(['main', 'origin/main'])) {
      // fastlyPublish chart also runs linting
      def chartChanges = sh(script: "git log --diff-filter=d -m -1 --name-only --pretty='format:' ${commit} | { grep 'charts/observe-edge-ui/Chart.yaml' || true; }", returnStdout: true)

      if (chartChanges) {
        publishedChartVersion = fastlyPublishChart(script: this, charts: ['charts/observe-edge-ui'])
      }
      def updates = []

      if (publishedChartVersion) {
        updates << [
            file: "workloads/stg-usc1/data-engineering/observe-edge-ui.yaml",
            keys: ["spec.chart.spec.version"],
            value: publishedChartVersion
        ]
      }
      if (publishedImageVersion) {
        updates << [
            file: "workloads/stg-usc1/data-engineering/observe-edge-ui.yaml",
            keys: ["spec.values.image.tag"],
            value: publishedImageVersion
        ]
      }
      if (publishedChartVersion || publishedImageVersion) {
        pr = updateElevationData(
          script: this,
          name: "${env.JOB_BASE_NAME}-${commit.take(7)}",
          updates: updates
        )
        def containerVersion = fastlyDockerBuild(script: this, containers: containers)
        if (slackChannel) {
          slackSend color: 'good', message: "Created ElevationData Release [observe-edge-ui:${containerVersion}] PR: ${pr.github_pr_url}", channel: slackChannel
        }
      }
    } else {
      def chartChanges = sh(script: "git diff --name-only origin/main HEAD | { grep 'charts/observe-edge-ui' || true; }")
      if (chartChanges) {
        fastlyLintChart(script: this, charts: ['charts/observe-edge-ui'])
      }
    }
  }
}
