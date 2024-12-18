import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { supabase } from '~/lib/supabase';

export function AppleSignIn() {
  if (Platform.OS === 'ios') {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: '100%', height: 50 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              });
              console.log(JSON.stringify({ user, error }, null, 2));

              if (!error) {
                console.log('User signed in');
              } else {
                throw new Error('DEBUG: No Identity token!');
              }
            }
          } catch (error: any) {
            console.log(error);

            if (error.code === 'ERR_REQUEST_CANCELED') {
              console.log('User cancelled the sign in process');
            } else {
              console.log('An error occurred during sign in');
            }
          }
        }}
      />
    );
  }
}
