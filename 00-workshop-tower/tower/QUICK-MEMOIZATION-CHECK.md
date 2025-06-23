# ⚡ Verificação Rápida de Memoização

## 🚨 Antes de Salvar Qualquer Arquivo React

### Checklist de 30 Segundos:

1. **Procure por `useEffect(`** ✅
   - Verifique se há **funções** nas dependências
   - Verifique se há **objetos** nas dependências
   - Verifique se há **arrays** nas dependências

2. **Padrões Problemáticos:**
   ```typescript
   // ❌ PERIGO!
   useEffect(() => {}, [someFunction])
   useEffect(() => {}, [{ key: 'value' }])
   useEffect(() => {}, [config])
   ```

3. **Soluções Rápidas:**
   ```typescript
   // ✅ SEGURO
   useEffect(() => {
     someFunction() // Chamar dentro
   }, [dependency1, dependency2])
   
   // ✅ SEGURO  
   const memoizedValue = useMemo(() => someFunction(), [deps])
   ```

### 🔍 Comando Mental:

**"Toda dependência do useEffect é primitiva (string, number, boolean) ou memoizada?"**

- Se **SIM** ✅ → Salve o arquivo
- Se **NÃO** ❌ → Corrija primeiro!

### 🚨 Sintomas de Problema:

- Componente pisca
- Logs infinitos no console
- Cursor travando
- Performance ruim

### 💡 Dica Ouro:

Quando em dúvida, remova a dependência das `[]` e chame dentro do `useEffect()`.

---

**Tempo de verificação: 30 segundos | Tempo economizado: horas de debug 🎯** 