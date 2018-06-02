import React, { Fragment } from 'react';
import { Grid, Icon, Header, Label, Popup } from 'semantic-ui-react';
import {
  filterTransactions,
  calculateAmount,
  renderMessage,
  sortTransactions
} from './utils';

const renderDate = timestamp => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date - offset).toUTCString();
};

const renderIcon = (sortByValue, index) => {
  if (index === 0 && sortByValue) {
    return (
      <Icon
        circular
        className="top-message"
        fitted
        name="trophy"
        size="large"
        title="Top message!"
      />
    );
  } else if (index === 0 && !sortByValue) {
    return (
      <Icon
        className="most-recent-message"
        name="clock"
        size="big"
        title="Most recent message."
      />
    );
  }
  return <Icon className="standard-message" name="comment" size="large" />;
};

const shortHash = (network, hash) => {
  const explorer =
    network === 'testnet'
      ? 'http://bob.nem.ninja:8765/#/transfer/'
      : 'http://explorer.nemchina.com/#/s_tx?hash=';
  return (
    <a href={`${explorer}${hash}`}>
      {`${hash.substring(0, 8)}…${hash.substring(hash.length - 8)}`}
    </a>
  );
};

const TransactionList = props => {
  const transactionList = [
    ...props.transactionsUnconfirmed,
    ...props.transactionsRecent
  ];
  const filtered = filterTransactions(props.address, transactionList);
  const sorted = props.sortByValue ? sortTransactions(filtered) : filtered;

  if (!sorted.length && !props.isUpdating) {
    return (
      <Grid.Row>
        <Grid.Column textAlign="center" verticalAlign="middle">
          <Header size="large">
            No wishes have been made using this address.{' '}
            <span role="img" aria-label="Crying face.">
              😢
            </span>
          </Header>
        </Grid.Column>
      </Grid.Row>
    );
  }

  sorted.length = props.transactionsMax ? props.transactionsMax : 0;

  return sorted.map((tx, index) => (
    <Grid.Row className="transaction" key={tx.signature}>
      {!tx.transactionInfo && (
        <Label
          corner="right"
          color="red"
          icon="clock"
          title="This transaction has not yet been confirmed by the network."
        />
      )}
      <Grid.Column
        className="message-icon"
        textAlign="left"
        width={3}
        verticalAlign="top"
      >
        {renderIcon(props.sortByValue, index)}
      </Grid.Column>
      <Grid.Column
        className="message-body"
        textAlign="center"
        verticalAlign="middle"
        width={10}
      >
        <Header
          size={index === 0 ? 'large' : 'medium'}
          style={{ wordBreak: 'break-word' }}
        >
          {renderMessage(tx)}
        </Header>
      </Grid.Column>
      <Grid.Column
        className="message-value"
        textAlign="right"
        width={3}
        verticalAlign="bottom"
      >
        <Popup
          flowing
          hoverable
          inverted
          position="bottom right"
          trigger={
            <Header size="small">
              {!tx.transactionInfo && tx.type === 247
                ? calculateAmount(tx) / 1000000
                : calculateAmount(tx)}{' '}
              XEM
            </Header>
          }
        >
          <p>
            <Icon name="hashtag" />
            {tx.transactionInfo
              ? shortHash(props.network, tx.transactionInfo.hash.data)
              : 'To be confirmed…'}
            <br />
            <Icon name="time" /> {renderDate(tx.timeWindow.timeStamp)}
            <br />
            {tx.type === 4100 ? (
              <Fragment>
                <Icon name="users" title="Multisig" />
              </Fragment>
            ) : (
              ''
            )}
          </p>
        </Popup>
      </Grid.Column>
    </Grid.Row>
  ));
};

export default TransactionList;
