import React, { Component } from 'react';
import moment from 'moment'
import { Link, Redirect } from 'react-router-dom';
import { RecommendationCard, InvitationCard, Alert } from '/imports/ui/components/ForboleComponents.jsx';

class InviteAccept extends Component {
  constructor(props){
    super(props);
    this.state = {
      fromDate: moment("20180311", "YYYYMMDD").fromNow(),
      acceptButton: '',
      accepted: false,
      loginAndAccept: false
    }
  }

  handleAccept = (e) => {
    e.preventDefault();
    Meteor.call('invites.accept', this.props.invite._id, (err, result) =>{
      if (result){
        this.setState({accepted: true});
        Meteor.call('connections.insert', this.props.invite.createdBy, "invite", this.props.invite._id, function(err, result){
          if (err){
            console.log(err);
          }
          if (result){
            console.log('connection created.')
          }
        });
      }
      else if (err) console.log(err);
    });
  }

  loginAndAccept = (e) => {
    e.preventDefault();
    let self = this;
    
    if (Meteor.status().connected){
      Meteor.call('invite.session', Meteor.default_connection._lastSessionId, self.props.inviteId, 'invite', (err, result) => {
        if (err){
          console.log(err);
        }
        if (result){
          self.setState({loginAndAccept:true});
          // console.log(result);
        }
      });
    }
  }

    render() {
      if (this.props.loading){
        return <div>Loading</div>
      }
      else if (this.state.accepted){
        return (
          <div className="main">
            <Alert type="success" text="You have accepted the invitation!" />
            <div className="text-center">
              <Link to={"/@"+Meteor.user().username} className="btn btn-primary btn-round">View your profile</Link>
            </div>
          </div>
        )
      }
      else if (this.state.loginAndAccept){
        return (<Redirect
          to={{
            pathname: "/login",
            state: { from: this.props.location }
          }}
        />);
      }
      else {
      	return (
    			<div className="main">
            {this.props.inviteExists?
			    		<div className="container">
                <div className="row">
                  {(this.props.invite.createdBy == Meteor.userId())?
                    <Alert
                      type="info"
                      text="This is a preview of a invitation you have sent."
                    />:''}
  			    			<h2 className="title text-center">{this.props.invite.toName}, you are invited!</h2>
  			    			<div className="col-md-12">
  			    				<p>You've got an invitation from
                      <Link to={"/@"+this.props.createdUser.username}>
                        <em> {this.props.invite.name}</em>
                      </Link> {moment(this.props.invite.createdAt,"YYYYMMDD").fromNow()}.
                    </p>
  								  <InvitationCard
                      createdBy={this.props.invite.name}
                      title={this.props.createdUser.profile.position}
                      picture={this.props.createdUser.profilePic()}
                      relationship={this.props.invite.relationship}
                      recommendation={this.props.invite.recoId?this.props.invite.recommendation().recommendation:null}
                      skills={this.props.invite.recoId?this.props.invite.recommendation().skills:null}
                      event={this.props.invite.recoId?this.props.invite.recommendation().event:null}
                    />
                    <div className="text-center">
                      <p>You can accept this invitation by clicking the button below.</p>
                      {Meteor.userId()?((this.props.invite.createdBy != Meteor.userId())?<button
                        className="btn btn-primary btn-round"
                        onClick={this.handleAccept}>Accept</button>:''):<button
                          className="btn btn-primary btn-round"
                          onClick={this.loginAndAccept}>Accept</button>
                      }
                    </div>
  							</div>
              </div>
						</div>
            :''}
				</div>
    	)
    }
	}
}

export default InviteAccept;
