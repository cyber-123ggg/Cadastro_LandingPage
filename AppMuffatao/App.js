import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert, Switch, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import { styles } from './src/styles/appStyles';
import { salvarProduto } from './src/services/productService';

const LISTA_CATEGORIAS = [
  "Açougue", 
  "Bebidas", 
  "Hortifruti", 
  "Limpeza", 
  "Mercearia", 
  "Padaria", 
  "Laticínios"
];

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoria, setCategoria] = useState('Mercearia');
  const [promocao, setPromocao] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setCodigo(data);
  };

  const escolherDaGaleria = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.6,
      base64: true, // Habilita Base64 para evitar o erro do FormData
    });

    if (!result.canceled) {
      setImagem(result.assets[0].base64 || result.assets[0].uri);
    }
  };

  const tirarFotoProduto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      base64: true, // Habilita Base64 para evitar o erro do FormData
    });

    if (!result.canceled) {
      setImagem(result.assets[0].base64 || result.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    const sucesso = await salvarProduto({ 
      codigo, 
      nome, 
      preco, 
      imagem, 
      categoria, 
      promocao 
    });
    
    if (sucesso) {
      setScanned(false);
      setCodigo('');
      setNome('');
      setPreco('');
      setImagem('');
      setCategoria('Mercearia');
      setPromocao(false);
    }
  };

  if (!permission) {
    return <Text style={styles.aviso}>Carregando permissões...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Precisamos da permissão da câmera para escaneamento.</Text>
        <Button onPress={requestPermission} title="Permitir Câmera" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Muffatão - Painel do Funcionário</Text>

      {/* Visor do Scanner */}
      <View style={styles.cameraContainer}>
        {!scanned ? (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "code128"],
            }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <TouchableOpacity style={styles.btnReescanear} onPress={() => setScanned(false)}>
            <Text style={styles.txtBtn}>Bipar Outro Produto</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.label}>Código de Barras:</Text>
        <TextInput 
          style={[styles.input, styles.inputReadOnly]} 
          value={codigo} 
          onChangeText={setCodigo}
          placeholder="Aguardando scanner..." 
        />

        <Text style={styles.label}>Nome do Produto:</Text>
        <TextInput 
          style={styles.input} 
          value={nome} 
          onChangeText={setNome} 
          placeholder="Ex: Arroz Tipo 1 - 5kg" 
        />

        <Text style={styles.label}>Preço (R$):</Text>
        <TextInput 
          style={styles.input} 
          value={preco} 
          onChangeText={setPreco} 
          keyboardType="numeric" 
          placeholder="19.90" 
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 15 }}>
          {LISTA_CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoria(cat)}
              style={{
                backgroundColor: categoria === cat ? '#e31c24' : '#e0e0e0',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: categoria === cat ? '#ffffff' : '#333333', fontWeight: 'bold', fontSize: 12 }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Oferta */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#fff0f0', padding: 10, borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#e31c24' }}>
            Produto em Oferta / Promoção? 🔥
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#ff4d4d' }}
            thumbColor={promocao ? '#e31c24' : '#f4f3f4'}
            onValueChange={setPromocao}
            value={promocao}
          />
        </View>

        {/* Foto */}
        <Text style={styles.label}>Foto do Produto:</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity 
            style={[styles.btnReescanear, { flex: 0.48, backgroundColor: '#555' }]} 
            onPress={escolherDaGaleria}
          >
            <Text style={styles.txtBtn}>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnReescanear, { flex: 0.48, backgroundColor: '#555' }]} 
            onPress={tirarFotoProduto}
          >
            <Text style={styles.txtBtn}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>

        {imagem ? (
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <Image 
              source={{ uri: imagem.startsWith('http') || imagem.startsWith('file') ? imagem : `data:image/jpeg;base64,${imagem}` }} 
              style={{ width: '100%', height: 180, borderRadius: 8 }} 
            />
            <TouchableOpacity onPress={() => setImagem('')} style={{ marginTop: 5 }}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Remover foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput 
            style={styles.input} 
            value={imagem} 
            onChangeText={setImagem} 
            placeholder="Ou cole a URL da imagem (https://...)" 
          />
        )}

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
          <Text style={styles.txtSalvar}>CADASTRAR NO BANCO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}