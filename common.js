const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');
const sidebarNav = document.getElementById('sidebar-nav');
const resourceContainer = document.getElementById('resource-container');
const previewModal = document.getElementById('preview-modal');
const previewContent = document.querySelector('.preview-content');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

function createNavItem(title, children, path) {
  const navItem = document.createElement('div');
  navItem.className = 'nav-item';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.textContent = title;
  navItem.appendChild(titleDiv);

  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  navItem.appendChild(dropdown);

  titleDiv.addEventListener('click', () => {
    dropdown.classList.toggle('active');
  });

  children.forEach(child => {
    if (child.type === 'directory') {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = child.name;
      link.dataset.path = child.path;
      dropdown.appendChild(link);

      link.addEventListener('click', (e) => {
        e.preventDefault();
        displayResources(child);
        document.querySelector('.content h1').textContent = child.name;
      });
    }
  });

  return navItem;
}

function createResourceSection(title, items) {
  const section = document.createElement('div');
  section.className = 'resource-section';

  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'resource-list';

  items.forEach(item => {
    if (item.type === 'file') {
      if (item.contentType === 'pdf') {
        const pdfTitle = item.name.replace('.pdf', '');
        const titleDiv = document.createElement('div');
        titleDiv.textContent = pdfTitle;
        titleDiv.style.marginBottom = '10px';

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '10px';

        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'resource-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.href = `/${item.path}`;
        downloadBtn.download = item.name;
        btnContainer.appendChild(downloadBtn);

        const previewBtn = document.createElement('button');
        previewBtn.className = 'resource-btn';
        previewBtn.textContent = 'Preview';
        previewBtn.addEventListener('click', () => previewPDF(item.path));
        btnContainer.appendChild(previewBtn);

        list.appendChild(titleDiv);
        list.appendChild(btnContainer);
      } else if (item.contentType === 'link') {
        const linkBtn = document.createElement('a');
        linkBtn.className = 'resource-btn';
        linkBtn.textContent = item.name.replace('.txt', '');
        linkBtn.href = item.content;
        linkBtn.target = '_blank';
        list.appendChild(linkBtn);
      }
    }
  });

  section.appendChild(list);
  return section;
}

async function previewPDF(filePath) {
  const url = `/${filePath}`;
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  previewContent.innerHTML = '';
  const container = document.createElement('div');
  container.style.overflowY = 'auto';
  container.style.maxHeight = '70vh';
  previewContent.appendChild(container);

  const renderPages = async (start, end) => {
    for (let pageNum = start; pageNum <= end && pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      container.appendChild(canvas);
    }
  };

  await renderPages(1, 3);

  container.addEventListener('scroll', async () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
      const lastRendered = container.children.length - 1;
      if (lastRendered < numPages) {
        await renderPages(lastRendered + 1, lastRendered + 3);
      }
    }
  });

  previewModal.classList.add('active');
}

// Close modal when clicking outside the preview content
previewModal.addEventListener('click', (e) => {
  if (e.target === previewModal) {
    console.log('Clicked outside, closing modal');
    previewModal.classList.remove('active');
    previewContent.innerHTML = '';
  }
});

async function loadAssets(category) {
  try {
    const response = await fetch(`http://localhost:3000/api/assets/${category}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const assets = await response.json();
    console.log('Assets loaded:', assets);

    sidebarNav.innerHTML = '';
    assets.forEach(category => {
      const navItem = createNavItem(category.name, category.children, category.path);
      sidebarNav.appendChild(navItem);
    });
  } catch (error) {
    console.error('Error loading assets:', error);
    resourceContainer.innerHTML = '<p>Failed to load resources. Please ensure the server is running at http://localhost:3000. Check console for details.</p>';
  }
}

function displayResources(directory) {
  resourceContainer.innerHTML = '';

  const allFiles = [];
  function flattenChildren(children) {
    children.forEach(child => {
      if (child.type === 'file') {
        allFiles.push(child);
      } else if (child.type === 'directory' && child.children) {
        flattenChildren(child.children);
      }
    });
  }
  flattenChildren(directory.children);

  const pdfs = allFiles.filter(item => item.contentType === 'pdf');
  const links = allFiles.filter(item => item.contentType === 'link');

  console.log('PDFs found:', pdfs);
  console.log('Links found:', links);

  if (pdfs.length > 0) {
    const pdfSection = createResourceSection('PDFs', pdfs);
    resourceContainer.appendChild(pdfSection);
  }

  if (links.length > 0) {
    const linkSection = createResourceSection('Links', links);
    resourceContainer.appendChild(linkSection);
  }

  if (pdfs.length === 0 && links.length === 0) {
    resourceContainer.innerHTML = '<p>No resources available yet.</p>';
  }
}

// Placeholder for category-specific initialization
function init(category) {
  loadAssets(category);
}