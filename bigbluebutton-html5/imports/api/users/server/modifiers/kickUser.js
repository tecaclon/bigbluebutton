import { check } from 'meteor/check';
import Users from '/imports/api/users';
import Logger from '/imports/startup/server/logger';

import setConnectionStatus from './setConnectionStatus';

const CLIENT_TYPE_HTML = 'HTML5';

export default function kickUser(meetingId, userId) {
  check(meetingId, String);
  check(userId, String);

  const selector = {
    meetingId,
    userId,
  };

  const User = Users.findOne(selector);

  const modifier = {
    $set: {
      'user.kicked': true,
      'user.connection_status': 'offline',
      'user.voiceUser.talking': false,
      'user.voiceUser.joined': false,
      'user.voiceUser.muted': false,
      'user.time_of_joining': 0,
      'user.listenOnly': false,
    },
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Kicking user from collection: ${err}`);
    }

    if (numChanged) {
      return Logger.info(`Kicked user id=${userId} meeting=${meetingId}`);
    }
  };

  return Users.update(selector, modifier, cb);
}
