import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e31c24',
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  aviso: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputReadOnly: {
    backgroundColor: '#e9ecef',
  },
  btnReescanear: {
    backgroundColor: '#e31c24',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSalvar: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  txtBtn: {
    color: '#fff',
    fontWeight: 'bold',
  },
  txtSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
