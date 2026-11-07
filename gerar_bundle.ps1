# Script para gerar o pacote único (plataforma_transpetro_bundle.html) e copiar para a Área de Transferência (Ctrl+V no Google Sites)
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = New-Object System.Text.UTF8Encoding($false)

$html = [System.IO.File]::ReadAllText((Join-Path $dir "index.html"), $utf8)
$css  = [System.IO.File]::ReadAllText((Join-Path $dir "styles.css"), $utf8)
$js1  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_edital_plano.js"), $utf8)
$js2  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_teoria.js"), $utf8)
$js3  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_questoes_parte1.js"), $utf8)
$js4  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_questoes_parte2.js"), $utf8)
$js5  = [System.IO.File]::ReadAllText((Join-Path $dir "app.js"), $utf8)

$html = $html.Replace('<link rel="stylesheet" href="styles.css">', "<style>`n$css`n</style>")
$html = $html.Replace('<link rel="stylesheet" href="styles.css" />', "<style>`n$css`n</style>")
$html = $html.Replace('<script src="dados_edital_plano.js"></script>', "<script>`n$js1`n</script>")
$html = $html.Replace('<script src="dados_teoria.js"></script>', "<script>`n$js2`n</script>")
$html = $html.Replace('<script src="dados_questoes_parte1.js"></script>', "<script>`n$js3`n</script>")
$html = $html.Replace('<script src="dados_questoes_parte2.js"></script>', "<script>`n$js4`n</script>")
$html = $html.Replace('<script src="app.js"></script>', "<script>`n$js5`n</script>")

$bundlePath = Join-Path $dir "plataforma_transpetro_bundle.html"
[System.IO.File]::WriteAllText($bundlePath, $html, $utf8)

try {
    Set-Clipboard -Value $html
    Write-Output "✅ Pacote atualizado em '$bundlePath' e COPIADO para a sua Área de Transferência! Basta dar Ctrl+V no Google Sites."
} catch {
    Write-Output "✅ Pacote atualizado em '$bundlePath'."
}

