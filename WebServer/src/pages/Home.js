import React from 'react';


const Home = () => {

    return (
      <div class="container auth">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css"/>
      <div class="card">
          <div class="header blue white-text center">
              <div class="card-content">LOGIN</div>
          </div>
          <div class="card-content">
              <div class="row">
                  <div class="input-field col s12 username">
                      <label>Username</label>
                      <input
                      name="username"
                      type="text"
                      class="validate"/>
                  </div>
                  <div class="input-field col s12">
                      <label>Password</label>
                      <input
                      name="password"
                      type="password"
                      class="validate"/>
                  </div>
                  <a class="waves-effect waves-light btn" href="/list">SUBMIT</a>
              </div>
          </div>
          <div class="footer">
              <div class="card-content">
                  <div class="right" >
                      New Here? <a>Create an account</a>
                  </div>
              </div>
          </div>
      </div>
      </div>
    );
};

export default Home;
