package com.cdac.util;

import java.io.InputStream;
import java.io.OutputStream;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.spec.SecretKeySpec;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES";

    private static final String SECRET_KEY =
            "1234567890123456";

    private static SecretKeySpec getKey() {
        return new SecretKeySpec(
                SECRET_KEY.getBytes(),
                ALGORITHM);
    }

    public static void encrypt(
            InputStream inputStream,
            OutputStream outputStream) {

        try {
            Cipher cipher =
                    Cipher.getInstance(ALGORITHM);

            cipher.init(Cipher.ENCRYPT_MODE, getKey());

            CipherOutputStream cipherOutputStream =
                    new CipherOutputStream(outputStream, cipher);

            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                cipherOutputStream.write(buffer, 0, bytesRead);
            }

            cipherOutputStream.close();

        } catch (Exception e) {
            throw new RuntimeException("File Encryption Failed");
        }
    }

    public static void decrypt(
            InputStream inputStream,
            OutputStream outputStream) {

        try {
            Cipher cipher =
                    Cipher.getInstance(ALGORITHM);

            cipher.init(Cipher.DECRYPT_MODE, getKey());

            CipherInputStream cipherInputStream =
                    new CipherInputStream(inputStream, cipher);

            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = cipherInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            cipherInputStream.close();

        } catch (Exception e) {
            throw new RuntimeException("File Decryption Failed");
        }
    }
}