import nem from 'nem-sdk';
import React from 'react';
import { Button, Grid, Icon, Transition } from 'semantic-ui-react';
import { ADDRESS } from './App';
import QrCode from './QrCode';

const handleCopy = props => {
  const textarea = document.createElement('textarea');
  textarea.id = 'temp-nem-address';
  textarea.style.height = 0;
  document.body.appendChild(textarea);
  textarea.value = document.querySelector('.nem-address').innerText;
  textarea.select();
  const canCopy = document.execCommand('copy');
  if (canCopy) {
    document.execCommand('copy');
    textarea.selectionEnd = textarea.selectionStart;
    props.handleCopyTimeout();
  }
  document.body.removeChild(textarea);
};

const handleKeyPress = (props, e) => {
  if (e.charCode === 13) {
    handleCopy(props);
  }
};

const WishButton = props => (
  <Grid padded="vertically" stackable>
    <Grid.Row className="wish-button">
      <Grid.Column textAlign="center">
        <Button
          icon
          labelPosition="left"
          onClick={props.handleClick}
          size="large"
          style={{
            backgroundColor: '#47a3d1',
            color: '#fff',
            marginRight: 0,
            width: '16rem'
          }}
          tabIndex="0"
        >
          <Icon name="qrcode" />
          {props.showCode ? 'Done?' : 'Make a Wish'}
        </Button>
      </Grid.Column>
    </Grid.Row>
    <Transition
      animation="fade"
      duration={{ hide: 50, show: 200 }}
      unmountOnHide
      visible={props.showCode}
    >
      <Grid.Row
        centered
        columns="2"
        style={{ paddingTop: 0, paddingBottom: '2rem' }}
      >
        <Grid.Column textAlign="center">
          <QrCode />
        </Grid.Column>
        <Grid.Column>
          <p>
            Please send messages to this
            {ADDRESS.startsWith('T') ? <em> testnet </em> : ' '}
            address:
          </p>
          <div
            className="nem-address"
            role="button"
            tabIndex="0"
            onClick={() => handleCopy(props)}
            onKeyPress={e => handleKeyPress(props, e)}
          >
            {nem.utils.format.address(ADDRESS)}
          </div>
          <Transition
            animation="fade"
            duration={{ hide: 400, show: 50 }}
            unmountOnHide
            visible={props.showCopyMessage}
          >
            <p style={{ color: '#47a3d1', textAlign: 'center' }}>
              <Icon name="thumbs outline up" />
              Address copied to clipboard!
            </p>
          </Transition>
          <p>
            Your messages will appear as soon as they&rsquo;ve been confirmed.
          </p>
          <p>
            Both multisig and normal transfer transactions are supported (not
            encrypted).
          </p>
          <p>
            Due to the lack of testnet support in the mobile wallets, the QR
            code will not scan for testnet addresses. For now, please copy/paste
            the address.
          </p>
        </Grid.Column>
      </Grid.Row>
    </Transition>
  </Grid>
);

export default WishButton;
