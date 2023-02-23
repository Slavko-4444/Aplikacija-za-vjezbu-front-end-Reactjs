import React from 'react';

import Container from 'react-bootstrap/Container';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function HomePage() {
  return (
    <Container>
      <FontAwesomeIcon icon={faHouseUser}/>
       Kosovo je srce Srbije!!!
    </Container>
  );
}

export default HomePage;
