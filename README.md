# API-REST-JS

---

Contexto para a API:

Foi requisitado uma API que possa cumprir as seguintes funções: 

Cadastrar usuário, 

Atualizar usuário, 

Deletar usuário, 

listar todos os usuários cadastrados, 

ver o usuário logado, 

envio de imagens para um bucket com o retorno do caminho, 

que seja possível enviar postagens 

e que a tabela de `posts` esteja relacionada com a tabela de `users`. 

---

# Objetivos do projeto

- Usar os métodos do padrão REST.
- Utilizar os conhecimentos que detenho atualmente:
    - Criptografia
    - integração com banco de dados
    - Upload de arquivos
    - Biblioteca de validação

---

## Estrutura dos objetos

- Usurário
    - Id
    - name
    - email
    - idade
    - imagem
    - Data de criação da conta

---

# Post - Cadastro

Está rota deve ser acessada com o método `POST` através do: `/user`

O cadastro deve receber as seguintes informações:

- Usurário
    - nam
    - email
    - password
    - Idade
    - imagem
    

Cada campo possui requisitos que deve cumprir para poder prosseguir, os quis serão verificados pela biblioteca `joi` . Cada um possui uma mensagem para os possíveis casos de erro.

Caso o bloco `TryCatch` caia no  `error` , deve ser retornado um `status 500` e um objeto:

`{mensagem: “ erro interno do servidor “}`

Este será o padrão para das demais rotas do projeto.

Se nenhum dos erros acimas ocorrer a api fará a criptografia da senha, e enviará todos os dados informados para o banco de dados, com a senha já criptografada e devera retorna apenas um `status 201` e uma mensagem:`“ Cadastro realizado com sucesso “`

---

# POST - Login

Está rota deve ser acessada com o método `POST`através do: `/login`

A rota login deverá receber no  `body`da requisição:

- email
- password

Caso alguns dos campos obrigatórios não seja enviado, a api retornará um `status 400` e uma mensagem informando o erro, de acordo com o esquema dessa rota.

O controlador fará a busca para ver se o E-mail está cadastrado no banco de dados, e caso esteja, o usuário encontrado será atribuído para um objeto `user`, se o objeto `user` estiver vazio, o retorno será de um `status 404` e uma mensagem:`“ Usuário não encontrado “`.

Caso seja encontrado o usuário, será usado a função `compare` da biblioteca `bcrypt` para comparar a senha informado nessa requisição com a senha que estará no objeto `user`, se o retorno da comparação for falso, o retorno será de `status 401` e uma mensagem:`“ Senha inválida“`.

Se for verdadeiro, a api, usando a biblioteca `jsonwebtoken` , irá gerar um `token` que contem o `id` do `user`  e então retornará um `status 200` e um objeto: `{ user = {...}, token }`.

---

# POST - Upload

Está rota deve ser acessada com o método `POST` através do: `/upload`

Esta rota tem como proposito, possibilitar o upload para um bucket de arquivos e retornar a url para ser usada no cadastro de um novo usuário.

É importante que o uso dessa rota seja feito antes da criação do usuário que deseja cadastrar, já que não é possível atualizar o url que estará presente no banco de dados

O controlador desestrutura o ‘ file ‘ de dentro da requisição, e logo após faz o upload da imagem para o bucket, onde o arquivo será guardado dentro de um caminho que seguirá o padrão: `‘ users/id-novo-usuario/nome-do-aquirvo ‘` 

O retorno da função, será um `status 201` e o caminho em formato URL que **deve** ser passado na requisição de cadastro de usuário.

---

# GET - Obter todos os usuários

Está rota deve ser acessada com o método `GET` através do: `/`

Essa função apenas fará uma requisição na tabela `users`, onde selecionará todos os usuários encontrados.

O retorno será um array contendo vários objetos contendo apenas o nome e o e-mail.

---

# Middleware - Verificação de Login

Esse intermediários deve verificar se um `token` válido foi informado no authorization que está presente no cabeçalho da requisição.

Caso o `token` não seja informado ou não for valido, a função aqui retornará uma mensagem:`“ token não valido “`.

Caso o `token`  seja informado e valido, será feito a verificação usando a função `verify()` da biblioteca `jsonwebtoken` para obter o `id` que está no `token` e então, ocorrerá uma busca no banco de dados para ver se o `id` que foi tirado do `token`corresponde à alguém cadastrado no banco de dados.

Se não for encontrado o `user` do `token` informado, deve ser retornado uma mensagem: `“Usuario não encontrado”`.

Se for encontrado, vai ser passado todas as informações do `user`, exceto pela senha, para uma variável `usuario`, e esta variável será passada para o `req.userLoged`, para que possa ser usado nas rotas que procedem esse intermediário.

Depois, a função `“ verificarLogin() “` prosseguirá com um `next()`.

---

# Middleware - Validar Dados

Este é um intermediário que ficará responsável pelas validações de dados, os quais serão enviados nas rotas de Login, Cadastro e Atualizar, ele receberá um `schema` e irá conferir se os dados enviados nas requisições correspondem aos padrões descritos neste`schemas`.

O proposito desse intermediário é de não deixar as verificações como tamanho da senha, se o email é do tipo e-mail e etc. para os controladores.

Caso as propriedades informadas no corpo da requisição não sigam o `schema` que for enviado no intermediário, será retornado uma mensagem própria para cada regra que a propriedade não seguir, por exemplo: 

"O campo e-mail, deve ter um formato e-mail” ou ainda "O campo senha deve ter no mínimo 8 caracteres”.

---

# GET - Obter usuário Logado

Está rota deve ser acessada com o método `GET` através do: `/user`

Está rota terá a função de de mostrar todas as informações que vão estar na variável `userLoged` que fora criada pela Middleware verificar login, possuirá um `status 200` e um o retorno do objeto `userLoged`

---

# GET - Obter todos os posts

Está rota deve ser acessada com o método GET através do: `/user/:id?page`.

Essa rota fará o carregamentos de todos os posts de um perfil. Seria como “ acessar “ o perfil de um usuário e ver suas postagens.

A função desestrutura o `id` do `req.params` e em seguida faz uma busca dentro do banco de dados por aquele `id`, caso não seja encontrado, o retorno deve ser de um `status 404` e uma mensagem :  `“Usuário não encontrado.”` .Se encontrado, o código prossegue retornando as postagens de 5 em 5. O offset, ou seja, o inicio dessa paginação, deverá ser informado por um parâmetro `page` que deve ser informado na query da requisição, caso não seja informado, será retornado a primeira ‘ pagina ‘ : `offset = 0`.

---

# PUT - Atualizar usuário

Está rota deve ser acessada com o método `PUT` através do: `/user`

Está função tem como objetivo permitir atualização dos campos `nome`, `email`, `password` e `idade`.

Serão feitas verificações para ver se os novos atributos dessas propriedades seguem o `updateSchema`, e caso não sigam, haverá respostas adequadas para os casos de erros. 

Ao menos um campo é necessário para que seja feita a atualização.

A atualização será feita no usuário que estiver logado, que será obtido através do `token` que deve ser informado no `authorization` da requisição. 

Deve se notar que nesta rota o `email` será a única propriedade que será verificada se é igual ao `email` já presente, isto para evitar que caso seja enviado o mesmo `email`, o controlador não precise buscar se já existe esse `email` no banco de dados.

A senha será criptografada usando a função `hash` da biblioteca `bcrypt` e em seguida será feita uma atualização na tabela `users`, onde os campos que forem passados serão atualizados no banco de dados.

Caso nenhum erro aconteça o retorno será de um `status 200` e uma mensagem `“ Usuário atualizado com sucesso !“`.

---

# POST - Postagem

Está rota deve ser acessada com o método POST através do: `/postagem`

Está rota permite com que o usuário logado faça uma postagem que, será verificada para ver se atende aos requisitos, que neste caso será apenas de ter no máximo 50 caracteres e ser obrigatório uma propriedade conteúdo seja informada no body da requisição. Há mensagens para esses dois casos de erro.

O que vai ser enviado para o banco de dados será o `conteudo` e o `id_user`(id do usuário logado que fez a postagem). 

Caso tudo certo será retornado um `status 201` e uma mensagem: `“Postagem enviada!”`

---

# DELETE - Apagar usuário

Está rota deve ser acessada com o método `DELETE` através do: `/user`

Está rota fará a remoção do usuário do banco de dados.

 Mesmo que o usuário seja deleto, é possível notar que o `token` de certa forma ainda será valido, mesmo assim, não será possível acessar o sistema através dele, pois o intermediário ‘ `verificaLogin` ‘ busca pelo o id no banco de dados, e caso não encontre, impossibilita o acesso.


Caso tudo ocorra bem, o retorno da rota será de um `status 204` e uma mensagem: `“Usuário deletado com sucesso!`
