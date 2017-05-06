import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import {
  selectItem,
  selectLoading,
  selectError,
  selectSubmissions,
  selectLoggedIn,
  selectWatchedIntroduction
} from 'containers/App/selectors'

import {
  loadItem
} from '../App/actions'

import IntroSimple from 'containers/IntroSimple'
import Error from 'containers/Error'
import Loading from 'containers/Loading'
import Panes from 'containers/Panes'
import Image from 'containers/Image'
import Geotagger from 'containers/Geotagger'

export class HomePage extends React.Component {

  componentWillMount () {
    if (!this.props.item.id) {
      this.props.loadItem('nypl', this.props.params.id)
    }
  }

  componentWillReceiveProps (props) {
    // For now, only organization=nypl routes are supported!

    // user types in new route
    const newRouteId = this.props.item.id === this.props.params.id &&
      props.item.id === this.props.item.id && props.item.id &&
      props.params.id !== this.props.params.id

    // path is /:incorrect-id, user/app wants to go to /
    const fromIncorrectIdToRandomId = this.props.error && !props.params.id && this.props.params.id

    // path is /:incorrect-id, user types in new id
    const fromIncorrectIdToNewId = this.props.error && props.params.id &&
      props.params.id !== this.props.params.id

    if (newRouteId || fromIncorrectIdToRandomId || fromIncorrectIdToNewId) {
      // Call loadItem with id from route (or undefined)
      this.props.loadItem('nypl', props.params.id)
    }
  }

  render () {
    let mainContent

    if (this.props.error) {
      mainContent = (
        <Error />
      )
    } else if (this.props.loading) {
      mainContent = (
        <Loading />
      )
    } else if (!this.props.watchedIntroduction && !this.props.loggedIn && !(this.props.submissions.completed > 0)) {
      mainContent = (
        <IntroSimple />
      )
    } else {
      mainContent = (
        <Panes>
          <Image />
          <Geotagger />
        </Panes>
      )
    }

    return mainContent
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadItem: (organizationId, id) => {
      dispatch(loadItem(organizationId, id))
    },
    dispatch
  }
}

export default connect(createSelector(
  selectItem(),
  selectLoading(),
  selectError(),
  selectSubmissions(),
  selectLoggedIn(),
  selectWatchedIntroduction(),
  (item, loading, error, submissions, loggedIn, watchedIntroduction) => ({
    item, loading, error, submissions, loggedIn, watchedIntroduction
  })
), mapDispatchToProps)(HomePage)
