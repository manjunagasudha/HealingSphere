// Simple client-side encryption utilities for additional privacy
// Note: This is for demonstration - real implementation would use proper E2E encryption

export class ClientCrypto {
  private static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encryptMessage(message: string, key?: CryptoKey): Promise<{ encrypted: string; key: CryptoKey }> {
    const cryptoKey = key || await this.generateKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cryptoKey,
      data
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
    combinedArray.set(iv);
    combinedArray.set(encryptedArray, iv.length);

    return {
      encrypted: btoa(String.fromCharCode(...combinedArray)),
      key: cryptoKey
    };
  }

  static async decryptMessage(encryptedData: string, key: CryptoKey): Promise<string> {
    const combinedArray = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combinedArray.slice(0, 12);
    const encrypted = combinedArray.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  static generateSessionId(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
