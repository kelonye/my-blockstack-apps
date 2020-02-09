import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { UserSession, AppConfig, Person } from 'blockstack';
import APPS from './apps.json';
import './App.css';
import Loader from './Loader';

const appConfig = new AppConfig();
const userSession = new UserSession({ appConfig });

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 30,
    marginBottom: 10,
  },
  container: {
    width: '100%',
    maxWidth: 360,
  },
}));

export default function() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [person, setPerson] = React.useState({});
  const [apps, setApps] = React.useState([]);
  const isUserSignedIn = userSession.isUserSignedIn();

  const handleSignIn = e => {
    e.preventDefault();
    userSession.redirectToSignIn();
  };

  const handleSignOut = e => {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  };

  const onMount = async() => {
    if (userSession.isSignInPending()) {
      await userSession.handlePendingSignIn();
      window.history.replaceState({}, document.title, '/');
    }

    const isUserSignedIn = userSession.isUserSignedIn();
    if (isUserSignedIn) {
      const p = new Person(userSession.loadUserData().profile);
      setPerson(p);
      setApps(
        Object.keys(p._profile.apps).map(website => {
          let [name, image] = APPS[website] ||
            APPS[website + '/'] || [website, ''];
          if (!image) {
            for (const _website in APPS) {
              const [_name, _image] = APPS[_website];
              if (-1 !== website.toLowerCase().search(_name.toLowerCase())) {
                name = _name;
                image = _image;
                break;
              }
            }
          }
          if (!image) {
            console.log(website);
          }
          return {
            name,
            website,
            image,
          };
        })
      );
    }

    setLoading(false);
  };

  React.useEffect(() => {
    onMount();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!isUserSignedIn)
    return (
      <div className="logged-out">
        <div className="logged-out--inner">
          <h1>Find out what Blockstack apps you've used before...</h1>
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: 18 }}
            onClick={handleSignIn}
          >
            Login with Blockstack
          </Button>
        </div>
      </div>
    );

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className="header">
          <div style={{ fontSize: 18, fontStyle: 'bold' }}>
            MY BLOCKSTACK APPS
          </div>
          <Button variant="contained" color="primary" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
        {!(person && person._profile) ? (
          <div style={{ fontSize: 11, marginTop: 20, textAlign: 'center' }}>
            You have not yet used any{' '}
            <a
              href="https://app.co/blockstack"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blockstack
            </a>{' '}
            app.
          </div>
        ) : (
          <List>
            {apps.map(({ name, website, image }) => (
              <ListItem
                key={website}
                button
                component="a"
                href={website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemAvatar>
                  <Avatar src={image} alt={name} />
                </ListItemAvatar>
                <ListItemText to={website} primary={name} secondary={website} />
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}
