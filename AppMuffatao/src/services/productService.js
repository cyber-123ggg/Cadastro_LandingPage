import { Alert } from 'react-native';
import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const IMGBB_API_KEY = "62b14b60328ca748336f6fceb7838c5a";

const uploadImagemImgBB = async (imagemInput) => {
  // Se já for um link web (http/https), não faz upload novamente
  if (imagemInput.startsWith('http://') || imagemInput.startsWith('https://')) {
    return imagemInput;
  }

  try {
    // Limpa o prefixo do base64 caso exista
    const cleanBase64 = imagemInput.replace(/^data:image\/\w+;base64,/, '');

    const formData = new FormData();
    formData.append('image', cleanBase64);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      console.error("Erro ImgBB:", data);
      throw new Error("Erro na resposta do ImgBB.");
    }
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
    throw new Error("Falha ao enviar foto para a nuvem.");
  }
};

export const salvarProduto = async ({ codigo, nome, preco, imagem, categoria, promocao }) => {
  if (!codigo || !nome || !preco) {
    Alert.alert("Campos Obrigatórios", "Por favor, preencha Código, Nome e Preço!");
    return false;
  }

  try {
    let urlImagemFinal = "https://via.placeholder.com/150";

    if (imagem) {
      urlImagemFinal = await uploadImagemImgBB(imagem);
    }

    const produtoData = {
      codigo: codigo.trim(),
      nome: nome.trim(),
      preco: parseFloat(preco),
      categoria: categoria || 'Geral',
      promocao: Boolean(promocao),
      imagem: urlImagemFinal,
      cadastradoEm: new Date().toISOString()
    };

    // Salva na coleção "produtos" no Firestore usando o código de barras como chave
    await setDoc(doc(db, "produtos", codigo.trim()), produtoData);

    Alert.alert(
      "Sucesso! 🚀",
      `O produto "${produtoData.nome}" foi cadastrado no banco com sucesso!`
    );

    return true;
  } catch (error) {
    Alert.alert("Erro ao salvar", "Ocorreu um erro: " + error.message);
    return false;
  }
};