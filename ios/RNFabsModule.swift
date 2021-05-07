//
//  RNFabsModule.swift
//  RNFabsModule
//
//  Copyright © 2021 jerloo. All rights reserved.
//

import Foundation

@objc(RNFabsModule)
class RNFabsModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
