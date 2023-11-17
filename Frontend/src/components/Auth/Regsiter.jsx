import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  Select,
} from '@chakra-ui/react';

export const fileUploadStyle = {
  cursor: 'pointer',
  marginLeft: '-5%',
  width: '110%',
  border: 'none',
  height: '100%',
  color: '#ECC94B',
  backgroundColor: 'white',
};
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [imagepreview, setImagepreview] = useState('');
  const [image, setImage] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const roles = ['Doctor', 'Patient', 'Nurse', 'Admin', 'Pharmacist'];

  const changeImageHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagepreview(reader.result);
      setImage(file);
    };
  };

  const navigate = useNavigate();

  const handleSubmit = async values => {
    try {
      const res = await axios.post('/api/v1/register', values);
      if (res.data.success) {
        console.log('Registered Successfully');
        navigate('/login');
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
      console.log('Something Went Wrong');
    }
  };

  return (
    <>
      <div className="main_login">
        <Box
          h={'100vh'} 
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box display="flex" flexDirection={['column', 'row']} width="30%" >
            <Box >
              <Heading children="Registration" marginTop="5" textAlign="center"  />

              <Box my="4" display="flex" justifyContent="center">
                <Avatar
                  src={imagepreview}
                  style={{ width: '20%', height: 'auto' }}
                />
              </Box>

              <Box>
                <form
                  style={{ width: '150%' }}
                  onSubmit={handleSubmit}
                  marginY="2"
                >
                  <Box>
                    <FormLabel htmlFor="name" children="Your Name" />
                    <Input
                      required
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="abc"
                      type="text"
                      focusBorderColor="yellow.500"
                    />
                  </Box>
                  <Box>
                    <FormLabel htmlFor="email" children="Email Address" />
                    <Input
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
                    <FormLabel htmlFor="password" children="Password" />
                    <Input
                      required
                      id="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter Your Password"
                      type="password"
                      focusBorderColor="yellow.500"
                    />
                  </Box>
                  <Box>
                    <FormLabel
                      htmlFor="chooseAvatar"
                      children="Choose Your Avatar"
                    />
                    <Input
                      accept="image/*"
                      required
                      css={fileUploadStyle}
                      id="chooseAvatar"
                      type="file"
                      focusBorderColor="yellow.500"
                      onChange={changeImageHandler}
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="Role" children="Select Role" />
                    <Select
                      required
                      id="role"
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      placeholder="Select Role"
                      focusBorderColor="yellow.500"
                    >
                      <option value=""></option>
                      {roles.map(role => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Box display="flex" justifyContent="center">
                    <Button my="4" colorScheme="yellow" type="submit">
                      Sign Up
                    </Button>
                  </Box>

                  <Box my="4" display="flex" justifyContent="flex-end">
                    Already Have an Account?{' '}
                    <Link to="/login">
                      <Button colorScheme="yellow" variant="link">
                        Login Here
                      </Button>
                    </Link>
                  </Box>
                </form>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Register;
