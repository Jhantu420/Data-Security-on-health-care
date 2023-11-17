import {
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from '../../asset/login.png';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    console.log('userData', userData);
  };

  const animations = {
    form: {
      initial: {
        x: '-20%',
        opacity: 0,
      },
      whileInView: {
        x: 0,
        opacity: 1,
      },
    },

    button: {
      initial: {
        y: '-100%',
        opacity: 0,
      },
      whileInView: {
        y: 0,
        opacity: 1,
      },
      transition: {
        delay: 0.5,
      },
    },
  };

  return (
    <div className="main_login">
      <Container h={'100vh'} maxWidth="xl">
        <VStack h={'full'} justifyContent={'center'} spacing={'16'}>
          <Heading
            children={'Welcome to Meddy_Buddy'}
            color={'yellow'}
            marginTop={'-6%'}
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 1.5)' }}
          />
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <motion.div
              initial="initial"
              animate="whileInView"
              variants={animations.form}
            >
              <Box
                className="form-container"
                padding={'50px'}
                borderRadius={'9px'}
                boxShadow={'2px 2px 4px rgba(0, 0, 1, 8.2)'}
                width="300px"
                height="auto"
                marginLeft={'-50%'}
              >
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <Box>
                    <FormLabel htmlFor="email" className="form-label">
                      Email Address
                    </FormLabel>
                    <Input
                      className="form-input"
                      required
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="abc@gmail.com"
                      type="email"
                      focusBorderColor="yellow.500"
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="password" className="form-label">
                      Password
                    </FormLabel>
                    <Input
                      className="form-input"
                      required
                      id="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter Your Password"
                      type="password"
                      focusBorderColor="yellow.500"
                      color={'black'}
                    />
                  </Box>

                  <Box display={'flex'} justifyContent={'flex-end'}>
                    <Link to="/forgotpassword" className="form-link">
                      Forget Password?
                    </Link>
                  </Box>

                  <Box display={'flex'} justifyContent={'center'}>
                    <Button
                      className="form-button"
                      my={'4'}
                      colorScheme={'yellow'}
                      type="submit"
                    >
                      Login
                    </Button>
                  </Box>

                  <Box my={'4'} display={'flex'} justifyContent={'flex-end'}>
                    New User?
                    <Link to="/register" className="form-link">
                      <Button
                        className="form-button"
                        colorScheme="yellow"
                        variant={'link'}
                      >
                        Sign Up
                      </Button>{' '}
                      Here
                    </Link>
                  </Box>
                </form>
              </Box>
            </motion.div>
            <motion.div>
              <Box width={'290%'}>
                <Image src={logo} width={'100%'} transform />
              </Box>
            </motion.div>
          </Box>
        </VStack>
      </Container>
    </div>
  );
};

export default Login;
