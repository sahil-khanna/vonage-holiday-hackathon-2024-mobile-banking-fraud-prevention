export class Constants {
  static readonly userProfiles = [
    {
      uid: '67460869dc840fad5b062a60',
      msisdn: '+9902345600',
      firstName: 'Steve',
      lastName: 'Rogers',
      accountNumber: '1093924873948769',
      locationCoordinates: {
        latitude: 10.78,
        longitude: 11.22,
      },
    },
    {
      uid: '67460bb3dc840fad5b062a61',
      msisdn: '+9902345601',
      firstName: 'Tony',
      lastName: 'Stark',
      accountNumber: '39393873948769',
      locationCoordinates: {
        latitude: 10.78,
        longitude: 11.22,
      },
    },
  ];

  static readonly VONAGE_API_DEFAULT_CONFIG = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
}
