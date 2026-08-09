import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import DatasetOverview from '../components/datasets/DatasetOverview';
import DatasetLibrary from '../components/datasets/DatasetLibrary';
import UploadDataset from '../components/datasets/UploadDataset';
import DatasetPreview from '../components/datasets/DatasetPreview';
import DataQualityDashboard from '../components/datasets/DataQualityDashboard';
import GovernmentDataSources from '../components/datasets/GovernmentDataSources';
import AIValidation from '../components/datasets/AIValidation';
import VersionHistory from '../components/datasets/VersionHistory';
import DatasetExport from '../components/datasets/DatasetExport';

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-72px)]">
          <div className="mb-6">
            <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Dataset Management & Government Data Hub</h1>
            <p className="text-sm text-gray-400 mt-1">Centralized management of governance datasets for AI-driven analysis.</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Row 1: Overview Cards */}
            <DatasetOverview />

            {/* Row 2: Library & Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <DatasetLibrary />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <UploadDataset />
                <GovernmentDataSources />
              </div>
            </div>

            {/* Row 3: Preview */}
            <div>
              <DatasetPreview />
            </div>

            {/* Row 4: Quality & AI Validation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <DataQualityDashboard />
              </div>
              <div className="lg:col-span-6">
                <AIValidation />
              </div>
            </div>

            {/* Row 5: Version History & Export */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <VersionHistory />
              </div>
              <div className="lg:col-span-4">
                <DatasetExport />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
