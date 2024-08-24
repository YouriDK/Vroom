import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { icons, images } from '../../constants';
import InputField from '../../components/InputFIeld';
import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import OAuth from '../../components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setform] = useState({ name: '', email: '', password: '' });
  // ! Might need to create 2 useState because apparently you cannot use one for two modals
  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({ ...verification, state: 'pending' });
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === 'complete') {
        // TODO Create a database User
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: 'success' });
      } else {
        setVerification({
          ...verification,
          error: 'Verification failed',
          state: 'failed',
        });
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.error[0].longMessage,
        state: 'failed',
      });
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className='z-0 w-full h-[250px]' />
          <View className='flex-1 bg-white'>
            <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>
              Create Your Account{' '}
            </Text>
          </View>
        </View>
        <View className='p-5'>
          <InputField
            label='Name'
            placeholder='Enter your name'
            icon={icons.person}
            value={form.name}
            onChangeText={(value: string) => setform({ ...form, name: value })}
          />
          <InputField
            label='Email'
            placeholder='Enter your email'
            icon={icons.email}
            value={form.email}
            onChangeText={(value: string) => setform({ ...form, email: value })}
          />
          <InputField
            label='Password'
            placeholder='Enter your password'
            secureTextEntry
            icon={icons.lock}
            value={form.password}
            onChangeText={(value: string) =>
              setform({ ...form, password: value })
            }
          />

          <CustomButton
            title='Sign Up'
            onPress={onSignUpPress}
            className='mt-6'
          />
          <OAuth />
          <Link
            href='/sign-in'
            className='text-lg text-center text-general-200 mt-10'
          >
            <Text>Already have an account ? </Text>
            <Text className='text-primary-500'>Log in</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          onModalHide={() =>
            setVerification({ ...verification, state: 'success' })
          }
        >
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Text className='text-2xl font-JakarataBold mb-2'> Loading...</Text>
            <Text className='font-JakarataBold mb-5'>
              {' '}
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label='Code'
              icon={icons.lock}
              placeholder='12345'
              value={verification.code}
              keyboardType='numeric'
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className='text-red-500 text-sm mt-1'></Text>
            )}

            <CustomButton
              title='Let us check this'
              onPress={onPressVerify}
              className='mt-5 bg-success-500'
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={verification.state === 'success'}>
          <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
            <Image
              source={images.check}
              className='w-[110px] h-[110px] mx-auto my-5'
            />
            <Text className='text-3xl font-JakarataBold text-center'>
              {' '}
              Verified
            </Text>
            <Text className='text-base text-gray-400 font-JakarataBold text-center'>
              {' '}
              Let's go King !
            </Text>
            <CustomButton
              title="Let's go home"
              onPress={() => router.replace('/(root)/(tabs)/home')}
              className='mt-5'
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
