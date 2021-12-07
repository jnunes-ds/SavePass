import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}


export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginDataProps[]>([]);
  const [data, setData] = useState<LoginDataProps[]>([]);

  async function loadData() {
    const dataKey = '@savepass:logins';
    try {
      const response = await AsyncStorage.getItem(dataKey);
      const tempData = JSON.parse(response);

      setSearchListData(tempData);
      setData(tempData);

    } catch (err) {
      const e = new Error(err);
      console.log(e.message);
    }
  }

  function handleFilterLoginData() {
    if (searchText !== '') {
      const tempData = data.filter(item => 
        item.service_name
          .toUpperCase()
          .includes(
            searchText.toUpperCase()
          ) ||
        item.email
          .toUpperCase()
          .includes(
            searchText.toUpperCase()
          )
      );
      setSearchListData(tempData);
    }
  }

  function handleChangeInputText(text: string) {
    setSearchText(text);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  useEffect(() => {
    handleFilterLoginData();
  }, [searchText]);

  return (
    <>
      <Header
        user={{
          name: 'Rocketseat',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}