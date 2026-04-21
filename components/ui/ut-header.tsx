import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const bannerImage = require('@/assets/images/ut-header-banner.png');

/**
 * UTransport branded header bar — uses the official banner logo image.
 * Place ut-header-banner.png in assets/images/.
 */
export function UTHeader() {
  return (
    <View style={s.bar}>
      <Image source={bannerImage} style={s.banner} resizeMode="contain" />
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: '#BF5700',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  banner: {
    height: 52,
    width: '75%',
  },
});
