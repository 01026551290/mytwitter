import React from 'react';
import {HashRouter as Router, Route , Switch} from "react-router-dom";
import {Redirect} from 'react-router';
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

const AppRouter = ( {refreshUser ,isLoggedIn , userObj} ) => {
    return (
        <Router>
            {/* &&은 앞에꺼가 트루면 뒤에껄 나타낸다 */}
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Switch>
                { isLoggedIn ? (
                    <div
                        style={{
                            maxWidth: 890,
                            width: "100%",
                            margin: "0 auto",
                            marginTop: 80,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile refreshUser={refreshUser} userObj={userObj} />
                        </Route>
                        <Redirect from="*" to="/" />
                    </div>
                ) : (
                  <>
                      <Route exact path="/">
                            <Auth />
                      </Route>
                      <Redirect from="*" to="/"/>
                  </>
                )}
            </Switch>
        </Router>
    );
};

export default AppRouter;