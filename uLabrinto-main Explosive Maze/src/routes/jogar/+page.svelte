<script lang="ts">
  import { goto } from '$app/navigation';

  class Coordenada {
    constructor(public linha: number = 0, public coluna: number = 0) {}
  }

  class EstadoJogo {
    posicaoPersonagem: Coordenada;
    posicaoObjetivo: Coordenada;
    posicaoBomba: Coordenada;
    mapa: number[][];
    temBomba: boolean;

    constructor(mapa: number[][], posPersonagem: Coordenada, posObjetivo: Coordenada, posBomba: Coordenada) {
      this.mapa = mapa;
      this.posicaoPersonagem = posPersonagem;
      this.posicaoObjetivo = posObjetivo;
      this.posicaoBomba = posBomba;
      this.temBomba = false;
    }
  }

  // ----------------- FASES -----------------
  const fases = [
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(7,20),
      posBomba: new Coordenada(3,5)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(7,20),
      posBomba: new Coordenada(4,4)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,19),
      posBomba: new Coordenada(5,5)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,19),
      posBomba: new Coordenada(2,5)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,20),
      posBomba: new Coordenada(7,3)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,19),
      posBomba: new Coordenada(5,6)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,0,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,20),
      posBomba: new Coordenada(3,4)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,20),
      posBomba: new Coordenada(6,6)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,19),
      posBomba: new Coordenada(2,5)
      
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(7,20),
      posBomba: new Coordenada(3,5)
    }
    
  ];

  const fasesEmbaralhadas = [...fases]; // Mantendo embaralhamento simples
  let faseAtualIndex = 0;
  let jogo: EstadoJogo = criarJogo(faseAtualIndex);
  let faseConcluida = false;

  function criarJogo(index: number): EstadoJogo {
    const f = fasesEmbaralhadas[index];
    const l = f.posObjetivo.linha;
    const c = f.posObjetivo.coluna;
    f.mapa[l][c] = 0;

    const adjacentes = [
      { dl: -1, dc: 0 },
      { dl: 1, dc: 0 },
      { dl: 0, dc: -1 },
      { dl: 0, dc: 1 }
    ];
    for (const { dl, dc } of adjacentes) {
      const nl = l + dl;
      const nc = c + dc;
      if (nl > 0 && nc > 0 && nl < f.mapa.length - 1 && nc < f.mapa[0].length - 1) {
        f.mapa[nl][nc] = 1;
      }
    }

    let bombaLinha: number, bombaColuna: number;
    do {
      bombaLinha = Math.floor(Math.random() * f.mapa.length);
      bombaColuna = Math.floor(Math.random() * f.mapa[0].length);
    } while (
      f.mapa[bombaLinha][bombaColuna] === 1 ||
      (Math.abs(bombaLinha - f.posPersonagem.linha) + Math.abs(bombaColuna - f.posPersonagem.coluna) < 6) ||
      (Math.abs(bombaLinha - l) + Math.abs(bombaColuna - c) < 6)
    );

    f.posBomba = new Coordenada(bombaLinha, bombaColuna);

    return new EstadoJogo(f.mapa, f.posPersonagem, f.posObjetivo, f.posBomba);
  }

  function houveColisao(pos: Coordenada, jogo: EstadoJogo): boolean {
    return (
      pos.linha < 0 ||
      pos.coluna < 0 ||
      pos.linha >= jogo.mapa.length ||
      pos.coluna >= jogo.mapa[0].length ||
      jogo.mapa[pos.linha][pos.coluna] === 1
    );
  }

  function proximaFase() {
    faseAtualIndex++;
    faseConcluida = false;
    if (faseAtualIndex >= fasesEmbaralhadas.length) {
      alert('Parabéns! Você venceu todas as fases!');
      goto('/');
    } else {
      jogo = criarJogo(faseAtualIndex);
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    const novaPos = new Coordenada(jogo.posicaoPersonagem.linha, jogo.posicaoPersonagem.coluna);

    switch (event.key) {
      case 'ArrowUp': novaPos.linha--; break;
      case 'ArrowDown': novaPos.linha++; break;
      case 'ArrowLeft': novaPos.coluna--; break;
      case 'ArrowRight': novaPos.coluna++; break;
      case ' ':
        if (jogo.temBomba) {
          const adjacentes = [
            { dl:0, dc:1 },
            { dl:0, dc:-1 },
            { dl:1, dc:0 },
            { dl:-1, dc:0 }
          ];
          for (const {dl, dc} of adjacentes) {
            const l = jogo.posicaoPersonagem.linha + dl;
            const c = jogo.posicaoPersonagem.coluna + dc;
            if(l>0 && c>0 && l<jogo.mapa.length-1 && c<jogo.mapa[0].length-1) {
              if(jogo.mapa[l][c]===1) jogo.mapa[l][c]=0;
            }
          }
          jogo.temBomba=false;
          // Bomba reaparece instantaneamente em outro lugar
          let novaLinha, novaColuna;
          do {
            novaLinha = Math.floor(Math.random() * jogo.mapa.length);
            novaColuna = Math.floor(Math.random() * jogo.mapa[0].length);
          } while (
            jogo.mapa[novaLinha][novaColuna] === 1 ||
            (novaLinha === jogo.posicaoPersonagem.linha && novaColuna === jogo.posicaoPersonagem.coluna) ||
            (novaLinha === jogo.posicaoObjetivo.linha && novaColuna === jogo.posicaoObjetivo.coluna)
          );
          jogo.posBomba = new Coordenada(novaLinha, novaColuna);
        }
        return;
    }

    if (novaPos.linha===jogo.posicaoBomba.linha && novaPos.coluna===jogo.posicaoBomba.coluna){
      jogo.posicaoBomba = new Coordenada(-1,-1);
      jogo.temBomba = true;
    }

    if (novaPos.linha===jogo.posicaoObjetivo.linha && novaPos.coluna===jogo.posicaoObjetivo.coluna){
      faseConcluida = true;
      return;
    }

    if(!houveColisao(novaPos, jogo)){
      jogo.posicaoPersonagem = novaPos;
    }
  }
</script>

<style>
  table { border-collapse: collapse; }
  td { padding: 0; }
  .celula img { display:block; }
  .menu { display:block; margin-top:10px; font-size:1.2rem; text-decoration:none; }

  .btn-proxima {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2rem;
    background-color: #338b33;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .btn-proxima:hover { background-color: #3d4642; }

  .btn-reiniciar {
    margin-bottom: 10px;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #e63946;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .btn-reiniciar:hover { background-color: #d62828; }

  /* Overlay Fase Concluída */
  .overlay {
    position: fixed;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.7);
    display:flex;
    align-items:center;
    justify-content:center;
    color: #fff;
    font-size: 3rem;
    z-index: 100;
    flex-direction: column;
  }
</style>

<h1>Movimente o personagem até o objetivo</h1>
<p>Fase atual: {faseAtualIndex+1} / {fasesEmbaralhadas.length}</p>
<p>Bomba coletada: {jogo.temBomba ? 'Sim':'Não'}</p>

<!-- Botão de reiniciar fase -->
<button class="btn-reiniciar" on:click={() => {
  jogo = criarJogo(faseAtualIndex);
  faseConcluida = false;
}}>Reiniciar Fase</button>

<table>
  {#each jogo.mapa as linha,i}
    <tr>
      {#each linha as celula,j}
        {#if i===jogo.posicaoPersonagem.linha && j===jogo.posicaoPersonagem.coluna}
          <td class="celula personagem">
            <img src="/images/men.png" alt="Personagem" width="70" height="80"/>
          </td>
        {:else if i===jogo.posicaoObjetivo.linha && j===jogo.posicaoObjetivo.coluna}
          <td class="celula objetivo">
            <img src="/images/bau.png" alt="Objetivo" width="80" height="80"/>
          </td>
        {:else if i===jogo.posicaoBomba.linha && j===jogo.posicaoBomba.coluna}
          <td class="celula bomba">
            <img src="/images/Bomb_pixel.svg" alt="Bomba" width="80" height="80"/>
          </td>
        {:else if celula===0}
          <td class="celula">
            <img src="/images/grama.png" alt="Grama" width="80" height="80"/>
          </td>
        {:else}
          <td class="celula bloco">
            <img src="/images/parede.jpg" alt="Parede" width="80" height="80"/>
          </td>
        {/if}
      {/each}
    </tr>
  {/each}
</table>

{#if faseConcluida}
  <div class="overlay">
    <div>Fase Concluída!</div>
    <button class="btn-proxima" on:click={proximaFase}>Próxima Fase</button>
  </div>
{/if}

<br/>
<a class="menu" href="/">Voltar ao Menu</a>

<svelte:window on:keydown|preventDefault={onKeyDown} />
