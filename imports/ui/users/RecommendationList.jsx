import React, { Component } from 'react';
import moment from 'moment'
import { Link, Redirect } from 'react-router-dom';
import { RecommendationCard } from '/imports/ui/components/ForboleComponents.jsx';

class RecommendationList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recos: {},
            mode: 'R'
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        if (e.target.value == 'R') {
            this.setState({
                recos: this.props.recos,
                mode: 'R'
            })
        }
        else if (e.target.value == 'G') {
            this.setState({
                recos: this.props.recosSent,
                mode: 'G'
            });
        }

        console.log(this.state.mode);
    }

    render(){
        return (<div className="container" id="recommendations">
                <div className="row">
                    <div className="col-lg-5 col-md-6 col-sm-3">
                        <select className="selectpicker" data-style="select-with-transition" defaultValue="R" data-size="2" onChange={this.handleChange}>
                            <option value="R">Received</option>
                            <option value="G">Given</option>
                        </select>
                    </div>
                </div>
                <div className="row mansory">
                    {(this.state.mode == 'R') ? (this.state.recos.length > 0) ? this.state.recos.map((reco, i) =>
                        <RecommendationCard
                            key={i}
                            username={reco.creator().username}
                            picture={reco.creator().profilePic()}
                            createdBy={reco.creator().profile.name}
                            title={reco.creator().profile.position}
                            recommendation={reco.recommendation}
                            skills={reco.skills}
                            event={reco.event}
                            createdAt={reco.createdAt}
                        />) : '' :
                        (this.state.recos.length > 0) ? this.state.recos.map((reco, i) =>
                            <RecommendationCard
                                key={i}
                                username={(reco.acceptor()) ? reco.acceptor().username : ''}
                                picture={(reco.acceptor()) ? reco.acceptor().profilePic() : '/img/faces/default-profile.svg'}
                                createdBy={(reco.acceptor()) ? reco.acceptor().profile.name : reco.toName}
                                title={(reco.acceptor()) ? reco.acceptor().profile.position : ''}
                                recommendation={reco.recommendation}
                                skills={reco.skills}
                                event={reco.event}
                                createdAt={reco.createdAt}
                                notAccepted={(reco.acceptor()) ? false : true}
                            />) : ''}
                </div>
            </div>)
    }
}

export default RecommendationList;