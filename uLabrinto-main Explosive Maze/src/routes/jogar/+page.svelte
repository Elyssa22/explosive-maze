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
        [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1],
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
        [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
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
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,19),
      posBomba: new Coordenada(5,5)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
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
        [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
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
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      posPersonagem: new Coordenada(1,1),
      posObjetivo: new Coordenada(4,19),
      posBomba: new Coordenada(5,6)
    },
    {
      mapa: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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
    }
  ];

  // ----------------- EMBARALHAR FASES -----------------
  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map(a => ({ sort: Math.random(), value: a }))
      .sort((a,b) => a.sort - b.sort)
      .map(a => a.value);
  }

  const fasesEmbaralhadas = shuffleArray(fases);

  let faseAtualIndex = 0;
  let jogo: EstadoJogo = criarJogo(faseAtualIndex);

  function criarJogo(index: number): EstadoJogo {
  const f = fasesEmbaralhadas[index];

  const l = f.posObjetivo.linha;
  const c = f.posObjetivo.coluna;

  // Garantir que o objetivo não esteja sobre uma parede
  f.mapa[l][c] = 0;

  // Cercar o objetivo com blocos, se dentro do mapa
  const adjacentes = [
    { dl: -1, dc: 0 }, // cima
    { dl: 1, dc: 0 },  // baixo
    { dl: 0, dc: -1 }, // esquerda
    { dl: 0, dc: 1 }   // direita
  ];

  for (const {dl, dc} of adjacentes) {
    const nl = l + dl;
    const nc = c + dc;
    if (nl > 0 && nc > 0 && nl < f.mapa.length-1 && nc < f.mapa[0].length-1) {
      f.mapa[nl][nc] = 1; // colocar bloco
    }
  }

  // Gerar posição aleatória da bomba
  let bombaLinha: number, bombaColuna: number;
  do {
    bombaLinha = Math.floor(Math.random() * f.mapa.length);
    bombaColuna = Math.floor(Math.random() * f.mapa[0].length);
  } while (
    f.mapa[bombaLinha][bombaColuna] === 1 ||                                   // não sobre parede
    (Math.abs(bombaLinha - f.posPersonagem.linha) + Math.abs(bombaColuna - f.posPersonagem.coluna) < 6) || // não muito perto do personagem
    (Math.abs(bombaLinha - l) + Math.abs(bombaColuna - c) < 6)                 // não muito perto do objetivo
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
            // nunca destruir borda do mapa
            if(l>0 && c>0 && l<jogo.mapa.length-1 && c<jogo.mapa[0].length-1) {
              if(jogo.mapa[l][c]===1) jogo.mapa[l][c]=0;
            }
          }
          jogo.temBomba=false;
        }
        return;
    }

    if(novaPos.linha===jogo.posicaoBomba.linha && novaPos.coluna===jogo.posicaoBomba.coluna){
      jogo.posicaoBomba = new Coordenada(-1,-1);
      jogo.temBomba = true;
    }

    if(novaPos.linha===jogo.posicaoObjetivo.linha && novaPos.coluna===jogo.posicaoObjetivo.coluna){
      faseAtualIndex++;
      if(faseAtualIndex >= fasesEmbaralhadas.length){
        alert('Parabéns! Você venceu todas as fases!');
        goto('/');
        return;
      }else{
        alert(`Parabéns! Você completou a fase ${faseAtualIndex}`);
        jogo = criarJogo(faseAtualIndex);
        return;
      }
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
</style>

<h1>Movimente o personagem até o objetivo</h1>
<p>Fase atual: {faseAtualIndex+1} / {fasesEmbaralhadas.length}</p>
<p>Bomba coletada: {jogo.temBomba ? 'Sim':'Não'}</p>

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

<br/>
<a class="menu" href="/">Voltar ao Menu</a>

<svelte:window on:keydown|preventDefault={onKeyDown} />
