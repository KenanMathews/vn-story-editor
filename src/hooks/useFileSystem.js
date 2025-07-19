// hooks/useFileSystem.js
import { useState, useEffect } from "react";
import { VirtualFileSystem } from "../utils/fileSystem";

export const useFileSystem = () => {
  const [fs, setFs] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initFS = async () => {
      const fileSystem = new VirtualFileSystem();
      await fileSystem.init();
      setFs(fileSystem);

      // Load projects
      const allProjects = await fileSystem.db.getAll("projects");
      setProjects(allProjects);
      setLoading(false);
    };

    initFS();
  }, []);

  const createProject = async (name, template) => {
    if (!fs) return null;

    const project = await fs.createProject(name, template);
    setProjects((prev) => [...prev, project]);
    return project;
  };

  const loadProject = async (projectId) => {
    if (!fs) return;

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      const projectFiles = await fs.getProjectFiles(projectId);
      setFiles(projectFiles);
    }
  };

  const createFile = async (path, name, type, content) => {
    if (!fs || !currentProject) return;

    const file = await fs.createFile(
      currentProject.id,
      path,
      name,
      type,
      content
    );
    const updatedFiles = await fs.getProjectFiles(currentProject.id);
    setFiles(updatedFiles);
    return file;
  };

  const createFolder = async (path, name) => {
    if (!fs || !currentProject) return;

    const folder = await fs.createFolder(currentProject.id, path, name);
    const updatedFiles = await fs.getProjectFiles(currentProject.id);
    setFiles(updatedFiles);
    return folder;
  };

  const updateFile = async (path, content) => {
    if (!fs) return;

    await fs.updateFile(path, content);
    const updatedFiles = await fs.getProjectFiles(currentProject.id);
    setFiles(updatedFiles);
  };

  const deleteFile = async (path) => {
    if (!fs) return;

    await fs.deleteFile(path);
    const updatedFiles = await fs.getProjectFiles(currentProject.id);
    setFiles(updatedFiles);
  };

  const renameFile = async (oldPath, newName) => {
    if (!fs || !currentProject) return;

    const file = await fs.db.get("files", oldPath);
    if (!file) return;

    const pathParts = oldPath.split("/");
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join("/");

    const updatedFile = {
      ...file,
      path: newPath,
      name: newName,
      lastModified: new Date().toISOString(),
    };

    await fs.deleteFile(oldPath);
    await fs.db.put("files", updatedFile);

    const updatedFiles = await fs.getProjectFiles(currentProject.id);
    setFiles(updatedFiles);
  };
  const moveFile = async (
    sourceRelativePath,
    targetRelativePath,
    isFolder = false
  ) => {
    if (!fs || !currentProject) return;

    try {
      const sourcePath = `${currentProject.id}/${sourceRelativePath}`;
      const sourceFile = await fs.db.get("files", sourcePath);

      if (!sourceFile) {
        console.error("Source file not found:", sourcePath);
        return;
      }

      const fileName = sourceFile.name;
      const newRelativePath = targetRelativePath
        ? `${targetRelativePath}/${fileName}`
        : fileName;
      const newPath = `${currentProject.id}/${newRelativePath}`;

      const updatedFile = {
        ...sourceFile,
        path: newPath,
        lastModified: new Date().toISOString(),
      };

      if (isFolder) {
        const allFiles = await fs.db.getAllFromIndex(
          "files",
          "projectId",
          currentProject.id
        );
        const filesToMove = allFiles.filter(
          (file) =>
            file.path.startsWith(sourcePath + "/") || file.path === sourcePath
        );


        for (const file of filesToMove) {
          const relativePart = file.path.substring(sourcePath.length);
          const newFilePath = newPath + relativePart;

          await fs.db.delete("files", file.path);
          await fs.db.put("files", {
            ...file,
            path: newFilePath,
            lastModified: new Date().toISOString(),
          });
        }
      } else {
        await fs.db.delete("files", sourcePath);
        await fs.db.put("files", updatedFile);
      }

      const updatedFiles = await fs.getProjectFiles(currentProject.id);
      setFiles(updatedFiles);

    } catch (error) {
      console.error("❌ Error moving file/folder:", error);
    }
  };

  return {
    fs,
    projects,
    currentProject,
    files,
    loading,
    createProject,
    loadProject,
    createFile,
    createFolder,
    updateFile,
    deleteFile,
    renameFile,
    moveFile,
  };
};
