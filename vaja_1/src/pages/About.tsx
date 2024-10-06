import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const AboutPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        About the Lost and Found App
      </Typography>
      <Typography variant="body1" paragraph>
        The Lost and Found App is designed to help users easily report and find lost items. Whether you've lost something valuable or found an item that someone else has lost, this app provides a platform for communication and coordination between users.
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Features:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Report Lost Items" />
        </ListItem>
        <ListItem>
          <ListItemText primary="View Found Items" />
        </ListItem>
        <ListItem>
          <ListItemText primary="User-Friendly Interface" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Location-Based Search" />
        </ListItem>
      </List>

      <Typography variant="body1" paragraph>
        Our goal is to make it easier for people to reconnect with their lost belongings and to foster a sense of community by encouraging users to help each other.
      </Typography>
    </Container>
  );
};

export default AboutPage;
