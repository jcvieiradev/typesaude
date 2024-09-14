function soma(a: number, b: number){
    return a + b
}

test('deve somar dois números corretamente', () => {

    //O padrão AAA (Arrange, Act, Assert)
    //O padrão AAA é uma maneira comum de escrever testes 
    //de unidade para um método em teste. 
    //Sua estrutura de desenvolver um teste seguindo 3 passos 
    //facilita a leitura e compreensão do código.


    //Preparação
    const num1 = 5
    const num2 = 4
    const resultadoEsperado = 9

    //Execução
    const response = soma(num1, num2)

    //Avaliação
    expect(response).toBe(resultadoEsperado)
})