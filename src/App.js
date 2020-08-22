import React from "react";
import { Auth, Hub } from "aws-amplify";
import { withAuthenticator, AmplifyTheme } from "aws-amplify-react";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import { Authenticator } from "aws-amplify-react/dist/Auth";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    this.getUserData();
    Hub.listen("auth", this, "onHubCapsule");
  }
  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }) : this.setState({ user: null });
  };
  onHubCapsule = (capsule) => {
    switch (capsule.payload.event) {
      case "signIn":
        console.log("Signned in");
        this.getUserData();
        break;
      case "signUp":
        console.log("signedUp");
        break;
      case "signOut":
        console.log("signed out");
        this.setState({ user: null });
        break;
      default:
        return;
    }
  };
  handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error("Erron signing out", err);
    }
  };

  render() {
    const { user } = this.state;

    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <Router>
        <React.Fragment>
          <Navbar user={user} handleSignOut={this.handleSignOut} />
          {/*Routes*/}
          <div className="app-container">
            <Route exact path="/" component={HomePage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route
              exact
              path="/markets/:marketId"
              component={({ match }) => (
                <MarketPage marketId={match.params.marketId} />
              )}
            />
          </div>
        </React.Fragment>
      </Router>
    );
  }
}
const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: "#808080",
  },
};

//export default withAuthenticator(App, true, [], null, theme);
export default App;
