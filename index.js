
function getDate () {
  var date = new Date;
  return date.toLocaleString()
}

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  
  app.log(`現在時間 ${getDate()} - Teemo on duty!`)

  /**
   * Pull request opened
   * auto add reviewer
   */
  app.on('pull_request.opened', async context => {

    const payload = context.payload.pull_request
    const user = payload.user.login

    app.log(`[ ${getDate()} ] [ pull_request.opened ] [ @${ user } ]`)

    app.log(`requestReviewers: `)
    const reviewersParams = context.pullRequest({ reviewers: ['TemmoOnDuty'] })
    context.github.pulls.requestReviewers(reviewersParams)

    app.log(`addAssignees: ${user}`)
    const assigneesParams = context.issue({ assignees: [user] })
    context.github.issues.addAssignees(assigneesParams)
    return 
  })

  /**
   * Pull request opened
   * auto assign to pull request owner
   */
  // app.on('pull_request.opened', async context => {

  //   const payload = context.payload.pull_request
  //   const user = payload.user.login

  //   app.log(`[ pull request open ] : from @${ user }`)

  //   const params = context.issue({ assignees: [user] })
  //   return context.github.issues.addAssignees(params)
  // })

  /** 
   * Pull request review
   * if PR approved, add label
   */
  var lableDic = {'ohlulu': 'ohlulu', 'TeemoOnduty': 'TeemoOnduty'};
  app.on('pull_request_review.submitted', async context => {

    const payload = context.payload.review
    const user = payload.user.login
    const state = payload.state 

    if (state === 'approved') {
      
      app.log(`[ ${getDate()} ] [ pull_request_review.submitted.approved ] [ @${ user } ]`)

      const label = lableDic[user]
      return context.github.issues.addLabels(context.issue({ labels:[label] }))
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
