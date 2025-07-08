<script lang="ts">
    import { goto } from '$app/navigation'    
    
    // tipo para guardar as coordenadas do personagem e do objetivo
    class Coordenada {
        linha : number
        coluna : number
    }

    // representa estado do jogo, contendo o mapa e a locação do personagem e do objetivo 
    class EstadoJogo {
        posicaoPersonagem : Coordenada
        posicaoObjetivo : Coordenada
        posicaobomba : Coordenada
        mapa : number[][]
    }

    // cria o estado do jogo
    function inicializarJogo() : EstadoJogo {
        let personagem : Coordenada = new Coordenada()
        personagem.linha = 2
        personagem.coluna = 2

        let objetivo : Coordenada = new Coordenada()
        objetivo.linha = 9
        objetivo.coluna = 9

        let bomba : Coordenada = new Coordenada()
        bomba.linha = 8
        bomba.coluna = 8

        let mapa: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];



        let estado : EstadoJogo = new EstadoJogo()
        estado.posicaoPersonagem = personagem
        estado.posicaoObjetivo = objetivo
        estado.posicaobomba = bomba
        estado.mapa = mapa

        return estado;
        
    }

    // detecta quando o personagem faz um movimento inválido 
    function houveColisao(posicao : Coordenada, jogo : EstadoJogo) : boolean {
        return (posicao.linha < 0 || posicao.coluna < 0)
            || (posicao.linha >= jogo.mapa.length || posicao.coluna >= jogo.mapa[0].length)
            || jogo.mapa[posicao.linha][posicao.coluna] == 1
    }

    // trata o evento de perssionar as setas no teclado
 	function onKeyDown(evento) : void {
        let novaPosicao = new Coordenada()
        novaPosicao.linha = jogo.posicaoPersonagem.linha
        novaPosicao.coluna = jogo.posicaoPersonagem.coluna

		 switch(evento.keyCode) {
			 case 38: // up
                novaPosicao.linha--
				break;
			 case 40: // down
                novaPosicao.linha++
				break;
			 case 37: // left
                novaPosicao.coluna--
				break;
			 case 39: // right
                novaPosicao.coluna++
				break;
		 }

        if (novaPosicao.linha == jogo.posicaoObjetivo.linha && novaPosicao.coluna == jogo.posicaoObjetivo.linha) {
            alert("Parabéns, você chegou ao objetivo")
            goto("/")
        }

        if(!houveColisao(novaPosicao, jogo)) {
            jogo.posicaoPersonagem = novaPosicao
        }
	}

    // cria o objeto contendo o estado do jogo
    let jogo : EstadoJogo = inicializarJogo()
    
</script>

<h1>Movimente o personagem (quadrado cinza) até o objetivo (quadrado roxo)</h1>

<table>
    {#each jogo.mapa as linha, i}
        <tr>
            {#each linha as celula, j}
                {#if i == jogo.posicaoPersonagem.linha &&  j == jogo.posicaoPersonagem.coluna}
                    <td class="celula personagem"><img src="/images/men.png" alt="" width="80px" height="80px"></td>
                {:else if i == jogo.posicaoObjetivo.linha &&  j == jogo.posicaoObjetivo.coluna}
                    <td class="celula objetivo"><img src="/images/bau.png" alt="" width="80px" height="80px"></td>
                {:else if i == jogo.posicaobomba.linha &&  j == jogo.posicaobomba.coluna}
                    <td class="celula bomba"><img src="/images/Bomb_pixel.svg" alt="" width="80px" height="80px"></td>
                {:else if jogo.mapa[i][j] == 0}
                    <td class="celula"><img src="/images/grama.png" alt="" width="80px" height="80px"></td>
                {:else}
                    <td class="celula bloco">
                        <img src="/images/parede.jpg" alt="" width="80px" height="80px">
                    </td>
                {/if}
            {/each}
        </tr>
    {/each}    
</table>

<br />

<a class="menu" href="/">Voltar ao Menu</a>

<svelte:window on:keydown|preventDefault={onKeyDown} />