export interface AppData {
  resultCount: number;
  results: App[];
}

export interface App {
  screenshotUrls: string[];
  artistViewUrl: string;
  appletvScreenshotUrls: string[];
  artworkUrl60: string;
  artworkUrl512: string;
  artworkUrl100: string;
  ipadScreenshotUrls: string[];
  trackCensoredName: string;
  fileSizeBytes: string;
  languageCodesISO2A: string[];
  sellerUrl: string;
  contentAdvisoryRating: string;
  averageUserRatingForCurrentVersion: number;
  userRatingCountForCurrentVersion: number;
  averageUserRating: number;
  trackViewUrl: string;
  trackContentRating: string;
  genreIds: string[];
  primaryGenreName: string;
  isVppDeviceBasedLicensingEnabled: boolean;
  releaseDate: string;
  trackId: number;
  trackName: string;
  formattedPrice: string;
  primaryGenreId: number;
  currentVersionReleaseDate: string;
  releaseNotes: string;
  minimumOsVersion: string;
  sellerName: string;
  version: string;
  description: string;
  artistId: number;
  artistName: string;
  genres: string[];
  price: number;
  bundleId: string;
  userRatingCount: number;
  isGameCenterEnabled: boolean;
  features: string[];
  supportedDevices: string[];
  advisories: string[];
  kind: string;
  averageUserRatingForCurrentVersionText: string;
  userRatingCountForCurrentVersionText: string;
  averageUserRatingText: string;
  ageRating: string;
  shortDescription: string;
  longDescription: string;
}
