// import app require library here
import React from 'react';
import { Grid, Input, Header, Button, Icon, Segment, Image, Divider, Table } from 'semantic-ui-react'
import moment from 'moment';

// Assets files import here
import githubLogo from './assets/github-logo.png';

// CSS files import here
import './App.css';

// import service related files
import { getRequest } from './services/api/requests.service';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilename: '',
      profileData: {},
      isActiveSearch: false,
      isErrorSearch: false,
      searchErrorMessage: ''
    }
  }

  updateProfilename = (ev) => {
    if (ev && ev.target) {
      this.setState({
        profilename: (ev.target.value || ''),
        isErrorSearch: false
      })
    }
  }

  trackProfile = async (ev) => {
    ev.preventDefault();
    console.log('state', this.state.profilename);

    this.setState({ isActiveSearch: true });

    const queryparams = {
      url: `https://api.github.com/users/${this.state.profilename}`
    }
    const response = await getRequest(queryparams);

    const status = (response && response.status) || '';

    let _state = {};

    if (response && status) {
      if (status === 200) {
        _state = {
          ..._state,
          isErrorSearch: false,
          profileData: response.data || {},
          searchErrorMessage: ''
        }
      } else {
        _state = {
          ..._state,
          isErrorSearch: true,
          searchErrorMessage: response.message
        }
      }
    }

    _state = {
      ..._state,
      isActiveSearch: false
    }

    this.setState(_state);
    console.log('response.data----> ', response.data);
  }

  render() {
    const _this = this;
    return (
      <section className='app-wrapper'>

        <Grid className='app-container'>
          <Grid.Column>
            <Segment placeholder className='app-segment'>
              <Header icon>
                <Icon name='search' />
                GITHUB PROFILE OUTLOOK
              </Header>
              <Segment.Inline>
                <form onSubmit={_this.trackProfile}>
                  <Input
                    loading={_this.state.isActiveSearch}
                    error={false}
                    value={_this.state.profilename}
                    onChange={_this.updateProfilename}
                    icon='users'
                    iconPosition='left'
                    size='large'
                    placeholder='Search users...'
                  />
                  <Button color='teal' size='small' className="app-search-btn">
                    Go Outlook
                    <Icon name='right send' />
                  </Button>
                </form>
              </Segment.Inline>
            </Segment>
          </Grid.Column>
        </Grid>
        {
          _this.state.isErrorSearch && (
            <p className='profile-err-content'>{_this.state.searchErrorMessage}</p>
          )
        }
        {
          _this.state.isActiveSearch && (
            <p className='profile-loading-content'>Loading...</p>
          )
        }
        {
          (!_this.state.isErrorSearch && Object.keys(_this.state.profileData).length > 0) &&
          (
            <Grid columns={1} className='profile-container'>
              <Grid.Column className='profile-header'>
                <Image className='profile-header-img' src={(_this.state.profileData.avatar_url || githubLogo)} size='small' circular />
                {
                  _this.state.profileData.name && (
                    <Header size='large'>{_this.state.profileData.name || _this.state.profilename}</Header>
                  )
                }
                <Header size='medium'>{_this.state.profileData.login || _this.state.profilename}</Header>
                {
                  _this.state.profileData.bio && (
                    <Header size='tiny'>Bio: {_this.state.profileData.bio}</Header>
                  )
                }
              </Grid.Column>
              <Grid.Column>
                <Divider horizontal>
                  <Header as='h4'>
                    <Icon name='user circle' />
                    Profile Details
                  </Header>
                </Divider>

                <Table definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Profile Page Link</Table.Cell>
                      <Table.Cell>
                        <a href={_this.state.profileData.html_url || 'javascript:void(0);'} target='_blank'>
                          Visit <Icon name='external' />
                        </a>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Public Repositories</Table.Cell>
                      <Table.Cell>{_this.state.profileData.public_repos || 0}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Followers</Table.Cell>
                      <Table.Cell>{_this.state.profileData.followers || 0}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Following</Table.Cell>
                      <Table.Cell>{_this.state.profileData.following || 0}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Profile Created</Table.Cell>
                      <Table.Cell>{moment((_this.state.profileData.created_at || '')).format('MMMM Do YYYY')}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid>
          )
        }

      </section>
    );
  }
}

export default App;
