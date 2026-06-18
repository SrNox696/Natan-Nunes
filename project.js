document.addEventListener('DOMContentLoaded', () => {
    // Obter o parâmetro 'id' do URL (ex: project.html?id=design-viagens)
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    const contentSection = document.getElementById('project-content');
    
    // Verificar se o ID existe na nossa base de dados 'projectsData'
    if (projectId && projectsData && projectsData[projectId]) {
        const project = projectsData[projectId];
        
        let mediaHtml = '';
        if (project.type === 'video') {
            mediaHtml = `<video src="${project.url}" autoplay loop controls playsinline></video>`;
        } else {
            mediaHtml = `<img src="${project.url}" alt="${project.title}">`;
        }
        
        const currentLang = localStorage.getItem('selectedLang') || 'pt';
        const projectTitle = project.title[currentLang] || project.title.pt;
        const projectCategory = project.category[currentLang] || project.category.pt;
        const projectDesc = project.description[currentLang] || project.description.pt;

        // Injetar o HTML do projeto
        contentSection.innerHTML = `
            <div class="project-details-grid">
                <div class="project-media reveal-left active">
                    ${mediaHtml}
                </div>
                <div class="project-info reveal-right active">
                    <span class="project-category" data-project-id="${projectId}" data-type="category">${projectCategory}</span>
                    <h1 class="project-title gradient-text" data-project-id="${projectId}" data-type="title">${projectTitle}</h1>
                    <p class="project-description" data-project-id="${projectId}" data-type="desc">${projectDesc}</p>
                    <a href="index.html" class="btn btn-primary" data-i18n="btn_more_projects">
                        Ver mais projetos
                    </a>
                </div>
            </div>
        `;
    } else {
        // Se o projeto não for encontrado, mostrar mensagem de erro
        contentSection.innerHTML = `
            <div class="error-message glass reveal active">
                <h2 class="gradient-text" data-i18n="error_not_found_title">Projeto Não Encontrado</h2>
                <p data-i18n="error_not_found_desc">Parece que o projeto que procura não existe ou foi removido.</p>
                <br>
                <a href="index.html" class="btn btn-primary" data-i18n="btn_back_home">Voltar à Página Inicial</a>
            </div>
        `;
    }
});
