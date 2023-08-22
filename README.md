# api-rest-js

# Escopo Api Rest

API Rest é uma abordagem popular para a construção de serviços da web. O escopo de uma API Rest é definido como a funcionalidade exposta para os clientes. Isso inclui os endpoints disponíveis, os métodos HTTP suportados e quaisquer parâmetros ou corpos de solicitação necessários. O escopo da API Rest deve ser cuidadosamente definido para garantir que atenda às necessidades do cliente sem se tornar excessivamente complexo ou difícil de manter.

Está API em si, tem como proposito simular um sistema de funcionários de um empresa, que permita consulta, adicionar novos funcionários, remover funcionários  

# Objetivos do projeto

- Usar todos os métodos do padrão REST.
- Utilizar os conhecimentos que detenho atualmente
    - Criptografia
    - integração com banco de dados postgres

---

## Estrutura dos objetos

- Usurário
    - Id
    - Nome
    - Email
    - Idade
    - Imagem
    - Data de criação da conta
    - Cargo

---

# Post - Cadastro

O cadastro deve receber as seguintes informações:

- Usurário
    - Nome *
    - E-mail *
    - Senha *
    - Idade
    - Imagem
    - Data de admissão na empresa
    - Cargo *
    

Caso o ocorra falte algum campo obrigatório ( * ), o retorno será de um `status 400` e um objeto :

`{mensagem : “ Os campos Nome, E-mail, Senha e Cargo são obrigatórios “ }` 

Caso o bloco `TryCatch` caio no  `error` , deve ser retornado um `status 500` e um objeto:

`{mensagem: “ erro interno do servidor “}`

Se nenhum dos erros acimas ocorrer a api fará a criptografia da senha, e enviará todos os dados informados para o banco de dados, com a senha já criptografada e devera retorna apenas um `status 201` e um objeto :

`{mensagem :  “ Cadastro realizado com sucesso “}`

---

# POST - Login

A roda login deverá receber no  `body`da requisição:

- E-mail *
- Senha *

Caso alguns dos campos obrigatórios não seja enviado, a api retornará um `status 400` e um objeto:

`{mensagem: “ Os campos E-mail e Senha são obrigatórios ”}`

O controlador fara a busca para ver se o E-mail está cadastrado no banco de dados e retornado para um objeto `user`, se o objeto `user` estiver vazio, o retorno será de um `status 404` e um objeto :

`{mensagem: “ Usuário não encontrado “}`

Caso seja encontrado o usuário, será usado a função `compare` da biblioteca `bcrypt` para comparar a senha informado nessa requisição com a senha que estará no objeto `user`, se o retorno da função for falso, o retorno será de `status 401` e um objeto:

`{mensagem: “ Senha incorreta “}`

Se for verdadeiro a api irá gerar um `token` que contem o id do `user` usando a biblioteca `jsonwebtoken` e então retornará um `status 200` e um objeto:

`{`

`user = {`

`nome,`

`e-mail,`

`idade,`

`cargo,`

`data de admissão` 

`}`

`token : token`

`}`
