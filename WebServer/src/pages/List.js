import React, { Component } from 'react';
// import queryString from 'query-string';
import ReactBasicTable from 'react-basic-table';
import * as service from '../lib/services';


class Plug extends Component {
  constructor(){
		super(...arguments);
		this.state = {
			plugs:[]
		};

    service.getAllContent().then(response => {
      console.log(response.data);
      this.setState({plugs:response.data});
    })
	}

  handlePermission = (id) => {
    console.log(id);
    // this.setState(
    //   ({num}) => ({
    //     plugs : this.state.plugs,
    //     num : id
    //   })
    // );
    service.putPermission(id).then(response => {
      console.log(response.data);
    });
  }

  handlePlug = (id, button) => {
    console.log(id + "," + button);
    // this.setState(
    //   ({num}) => ({
    //     plugs : this.state.plugs,
    //     num : id
    //   })
    // );
    service.putButton(id, button).then(response => {
      console.log(response.data);
    });
  }

  render(){
    var i = 0;
    var columns = ['id', 'Name', 'Permission','Permission change','plug1','plug2','plug3'];
    var rows = [];
    let plugs = this.state.plugs;
    for (i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        var item = [
            <span data-ReactBasicTable-value={'Row' + i}>{plug._id}</span>,
            <span data-ReactBasicTable-value={'Test' + i}>{plug.name}</span>,
            <span data-ReactBasicTable-value={'End' + i}>{plug.permission}</span>,
            <button onClick={(e) => this.handlePermission(plug._id)} data-ReactBasicTable-value={'Button'+i}>{'allow'}</button>,
            <button onClick={(e) => this.handlePlug(plug._id, 1)} data-ReactBasicTable-value={'Button'+i+'_'+1}>{'click'}</button>,
            <button onClick={(e) => this.handlePlug(plug._id, 2)} data-ReactBasicTable-value={'Button'+i+'_'+2}>{'click'}</button>,
            <button onClick={(e) => this.handlePlug(plug._id, 3)} data-ReactBasicTable-value={'Button'+i+'_'+3}>{'click'}</button>
        ];
        rows.push(item);
    }

    return (

      <div>
        <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"/>
        <ReactBasicTable rows={rows} columns={columns} />
      </div>
    );

  }
};

export default Plug;
